const logger = require('../services/logger');
const languages = require('../config/languages');
const userSettings = require('../services/userSettings');
const database = require('../services/database');

const userStates = new Map();

const commands = {
    start: async (bot, msg) => {
        const chatId = msg.chat.id;
        
        const divider = '━━━━━━━━━━━━━━━━━━━━━━━━';
        const welcomeText = `${languages.en.welcome}\n\n${divider}\n\n${languages.kk.welcome}\n\n${divider}\n\n${languages.ru.welcome}`

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

        await bot.sendMessage(chatId, welcomeText, keyboard);
    },

    help: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        const helpText = Object.entries(lang.commands)
            .map(([cmd, desc]) => `/${cmd} - ${desc}`)
            .join('\n');
        
        await bot.sendMessage(chatId, helpText);
    },

    wallets: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        const wallets = database.getWallets(userId);
        
        if (!wallets || wallets.length === 0) {
            await bot.sendMessage(chatId, lang.wallet.listEmpty);
            return;
        }

        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    ...wallets.map(wallet => [
                        { text: wallet.name, callback_data: `manage_wallet_${wallet.id}` }
                    ])
                ]
            }
        };

        await bot.sendMessage(chatId, lang.wallet.listHeader, keyboard);
    },

    addwallet: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];
    
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: lang.wallet.defaultWallet,    callback_data: 'wallet_cash' },
                        { text: lang.wallet.defaultDeposit, callback_data: 'wallet_deposit' }
                    ],
                    [
                        { text: 'Kaspi',  callback_data: 'wallet_kaspi' },
                        { text: 'Halyk',  callback_data: 'wallet_halyk' },
                        { text: 'Forte',  callback_data: 'wallet_forte' }
                    ],
                    [
                        { text: `✏️ ${lang.wallet.customBtn}`, callback_data: 'wallet_custom' }
                    ]
                ]
            }
        };
    
        await bot.sendMessage(chatId, lang.wallet.chooseOrCreate, keyboard);
    },

    expense: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        await bot.sendMessage(chatId, 'Expense tracking feature coming soon!');
        logger.info(`Expense command executed by user ${userId}`);
    },

    income: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        await bot.sendMessage(chatId, 'Income tracking feature coming soon!');
        logger.info(`Income command executed by user ${userId}`);
    },

    report: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        await bot.sendMessage(chatId, 'Report generation feature coming soon!');
        logger.info(`Report command executed by user ${userId}`);
    },

    settings: async (bot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const language = userSettings.getLanguage(userId);
        const lang = languages[language];

        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🌐 ' + lang.settings.changeLanguage, callback_data: 'settings_language' },
                        { text: '🔄 ' + lang.settings.reset, callback_data: 'settings_reset' }
                    ]
                ]
            }
        };

        await bot.sendMessage(chatId, lang.settings.title, keyboard);
    },
};

module.exports = { commands, userStates }; 