const logger = require('../services/logger');
const languages = require('../config/languages');
const userSettings = require('../services/userSettings');
const database = require('../services/database');
const { commands, userStates } = require('../commands');

class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = new Map();
        this.setupCommandHandlers();
    }

    registerCommand(command, handler) {
        this.commands.set(command, handler);
        logger.info(`Command registered: ${command}`);
    }

    async handleCommand(msg) {
        const command = msg.text.split(' ')[0].toLowerCase();
        const handler = this.commands.get(command);

        if (handler) {
            try {
                await handler(this.bot, msg);
            } catch (error) {
                logger.error(`Error handling command ${command}:`, error);
                const userId = msg.from.id;
                const language = userSettings.getLanguage(userId);
                const lang = languages[language];
                await this.bot.sendMessage(msg.chat.id, 'Sorry, something went wrong while processing your command.');
            }
        } else {
            // Handle non-command messages (like custom wallet names)
            await this.handleMessage(msg);
        }
    }

    async handleMessage(msg) {
        const userId = msg.from.id;
        const chatId = msg.chat.id;
        const userState = userStates.get(userId);

        logger.info(`Handling message from user ${userId}:`, {
            text: msg.text,
            userState: userState
        });

        if (!userState) {
            logger.info(`No active state for user ${userId}`);
            return;
        }

        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        try {
            switch (userState.command) {
                case 'addwallet':
                    if (userState.step === 'waiting_name') {
                        const walletName = msg.text.trim();
                        logger.info(`Processing custom wallet name for user ${userId}:`, {
                            walletName,
                            length: walletName.length
                        });
                        
                        if (walletName.length < 2) {
                            logger.info(`Wallet name too short for user ${userId}`);
                            await this.bot.sendMessage(chatId, lang.wallet.nameTooShort);
                            return;
                        }

                        if (walletName.length > 32) {
                            logger.info(`Wallet name too long for user ${userId}`);
                            await this.bot.sendMessage(chatId, lang.wallet.nameTooLong);
                            return;
                        }

                        try {
                            database.createWallet(userId, walletName, 'KZT');
                            logger.info(`Custom wallet created for user ${userId}:`, { walletName });
                            await this.bot.sendMessage(chatId, lang.wallet.createSuccess);
                            userStates.delete(userId);
                        } catch (error) {
                            logger.error(`Error creating custom wallet for user ${userId}:`, error);
                            await this.bot.sendMessage(chatId, lang.wallet.createError);
                        }
                    }
                    break;
                default:
                    logger.warn(`Unknown command state for user ${userId}:`, userState);
                    break;
            }
        } catch (error) {
            logger.error('Error handling message:', error);
            await this.bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again.');
            userStates.delete(userId);
        }
    }

    async answerCallbackQuery(query, text = '') {
        try {
            await this.bot.answerCallbackQuery(query.id, { text });
        } catch (error) {
            if (error.message.includes('query is too old') || error.message.includes('query ID is invalid')) {
                logger.warn(`Callback query expired or invalid for user ${query.from.id}`);
            } else {
                logger.error('Error answering callback query:', error);
            }
        }
    }

    async handleLanguageSelection(query, language) {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        
        userSettings.setLanguage(userId, language);
        await this.bot.deleteMessage(chatId, query.message.message_id);
        
        const selectedLanguage = languages[language];
        await this.bot.sendMessage(chatId, selectedLanguage.languageSelected);
        await this.bot.sendMessage(chatId, 
            `${selectedLanguage.features}\n\n${selectedLanguage.help}`
        );
        
        await this.answerCallbackQuery(query, selectedLanguage.languageSelected);
    }

    async handleWalletCreation(query, type) {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        if (type === 'custom') {
            userStates.set(userId, { command: 'addwallet', step: 'waiting_name' });
            await this.bot.deleteMessage(chatId, query.message.message_id);
            await this.bot.sendMessage(chatId, lang.wallet.createPrompt);
            await this.answerCallbackQuery(query, lang.wallet.createPrompt);
            return;
        }

        const presetNames = {
            cash: lang.wallet.names.cash,
            deposit: lang.wallet.names.deposit,
            kaspi: 'Kaspi',
            halyk: 'Halyk',
            forte: 'Forte'
        };
        const walletName = presetNames[type];
        
        try {
            database.createWallet(userId, walletName, 'KZT');
            await this.bot.sendMessage(chatId, lang.wallet.createSuccess);
            await this.answerCallbackQuery(query, lang.wallet.createSuccess);
        } catch (e) {
            logger.error(`Error creating wallet "${walletName}" for user ${userId}:`, e);
            await this.bot.sendMessage(chatId, lang.wallet.createError);
            await this.answerCallbackQuery(query, lang.wallet.createError);
        }
    }

    async handleSettings(query, action) {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        switch (action) {
            case 'language':
                const keyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '🇬🇧 English', callback_data: 'lang_en' },
                                { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
                            ],
                            [
                                { text: '🇰🇿 Қазақша', callback_data: 'lang_kk' }
                            ]
                        ]
                    }
                };
                await this.bot.deleteMessage(chatId, query.message.message_id);
                await this.bot.sendMessage(chatId, lang.settings.selectLanguage, keyboard);
                await this.answerCallbackQuery(query, lang.settings.selectLanguage);
                break;

            case 'reset':
                const resetKeyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '✅ ' + lang.settings.confirmReset, callback_data: 'settings_reset_confirm' },
                                { text: '❌ ' + lang.settings.cancelReset, callback_data: 'settings_reset_cancel' }
                            ]
                        ]
                    }
                };
                await this.bot.deleteMessage(chatId, query.message.message_id);
                await this.bot.sendMessage(chatId, lang.settings.resetWarning, resetKeyboard);
                await this.answerCallbackQuery(query, lang.settings.resetWarning);
                break;

            case 'reset_confirm':
                try {
                    await database.resetUserData(userId);
                    await this.bot.deleteMessage(chatId, query.message.message_id);
                    await this.bot.sendMessage(chatId, lang.settings.resetSuccess);
                    await this.answerCallbackQuery(query, lang.settings.resetSuccess);
                } catch (error) {
                    logger.error(`Error resetting data for user ${userId}:`, error);
                    await this.bot.sendMessage(chatId, lang.settings.resetError);
                    await this.answerCallbackQuery(query, lang.settings.resetError);
                }
                break;

            case 'reset_cancel':
                await this.bot.deleteMessage(chatId, query.message.message_id);
                await this.bot.sendMessage(chatId, lang.settings.resetCancelled);
                await this.answerCallbackQuery(query, lang.settings.resetCancelled);
                break;
        }
    }

    async handleWalletManagement(query, walletId) {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        const wallet = database.getWalletById(userId, walletId);

        if (!wallet) {
            await this.bot.sendMessage(chatId, lang.wallet.notFound);
            await this.answerCallbackQuery(query, lang.wallet.notFound);
            return;
        }

        const walletInfo = `${lang.wallet.balance}: ${wallet.balance}\n${lang.wallet.currency}: ${wallet.currency}\n${lang.wallet.name}: ${wallet.name}`;

        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '💳 ' + lang.wallet.editBalance, callback_data: `manage_wallet_${walletId}_edit_balance` },
                        { text: '💰 ' + lang.wallet.editName, callback_data: `manage_wallet_${walletId}_edit_name` },
                    ],
                    [
                        { text: '💳 ' + lang.wallet.editCurrency, callback_data: `manage_wallet_${walletId}_edit_currency` },
                    ],
                    [
                        { text: '💳 ' + lang.income, callback_data: `manage_wallet_${walletId}_add_income` },
                        { text: '💳 ' + lang.expense, callback_data: `manage_wallet_${walletId}_add_expense` },
                    ],
                    [
                        { text: '🔙 ' + lang.wallet.back, callback_data: `wallets` },
                    ]
                ]
            }
        }

        await this.bot.deleteMessage(chatId, query.message.message_id);
        await this.bot.sendMessage(chatId, walletInfo, keyboard);
        await this.answerCallbackQuery(query, walletInfo);
    }

    setupCommandHandlers() {
        Object.entries(commands).forEach(([command, handler]) => {
            this.registerCommand(`/${command}`, handler);
        });

        this.bot.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const userId = query.from.id;
            const data = query.data;

            try {
                if (data.startsWith('lang_')) {
                    const language = data.split('_')[1];
                    await this.handleLanguageSelection(query, language);
                } else if (data.startsWith('wallet_')) {
                    const type = data.replace('wallet_', '');
                    await this.handleWalletCreation(query, type);
                } else if (data.startsWith('settings_')) {
                    const action = data.replace('settings_', '');
                    await this.handleSettings(query, action);
                } else if (data.startsWith('manage_wallet_')){
                    const walletId = data.replace('manage_wallet_', '');
                    await this.handleWalletManagement(query, walletId);
                } else {
                    await this.bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again.');
                }
            } catch (error) {
                logger.error('Error handling callback query:', error);
                try {
                    await this.bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again.');
                } catch (sendError) {
                    logger.error('Error sending error message:', sendError);
                }
            }
        });
    }
}

module.exports = CommandHandler; 