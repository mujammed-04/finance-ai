const TelegramBot = require('node-telegram-bot-api');
const logger = require('../services/logger');
const CommandHandler = require('../handlers/commandHandler');
const languages = require('../config/languages');

class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, { polling: true });
        this.commandHandler = new CommandHandler(this.bot);
        logger.info('Bot instance created');
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.bot.on('message', async (msg) => {
            try {
                if (msg.text && msg.text.startsWith('/')) {
                    await this.commandHandler.handleCommand(msg);
                } else {
                    await this.commandHandler.handleMessage(msg);
                }
            } catch (error) {
                logger.error('Error handling message:', error);
                try {
                    await this.bot.sendMessage(msg.chat.id, 'Sorry, something went wrong. Please try again.');
                } catch (sendError) {
                    logger.error('Error sending error message:', sendError);
                }
            }
        });

        this.bot.on('polling_error', (error) => {
            logger.error('Polling error:', error);
        });
    }

    async start() {
        try {
            await this.bot.setMyCommands([
                { command: 'wallets', description: 'List all wallets' },
                { command: 'addwallet', description: 'Create a new wallet' },
                { command: 'expense', description: 'Add an expense' },
                { command: 'income', description: 'Add an income' },
                { command: 'report', description: 'Generate reports' },
                { command: 'settings', description: 'Manage settings' },
                { command: 'help', description: 'Show help information' },
            ]);
            logger.info('Bot commands registered successfully');
        } catch (error) {
            logger.error('Error registering bot commands:', error);
            throw error;
        }
    }
}

module.exports = Bot;