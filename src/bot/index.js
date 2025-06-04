const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const logger = require('../services/logger');
const CommandHandler = require('../handlers/commandHandler');
const commands = require('../commands');

class Bot {
    constructor() {
        this.bot = new TelegramBot(config.bot.token, config.bot.options);
        this.commandHandler = new CommandHandler(this.bot);
        this.setupCommands();
        this.setupEventHandlers();
    }

    setupCommands() {
        Object.entries(commands).forEach(([command, handler]) => {
            this.commandHandler.registerCommand(`/${command}`, (msg) => handler(this.bot, msg));
        });
    }

    setupEventHandlers() {
        this.bot.on('message', async (msg) => {
            if (msg.text && msg.text.startsWith('/')) {
                await this.commandHandler.handleCommand(msg);
            } else if (msg.text) {
                // Handle regular messages
                try {
                    await this.bot.sendMessage(msg.chat.id, `You said: ${msg.text}`);
                } catch (error) {
                    logger.error('Error handling message:', error);
                }
            }
        });

        this.bot.on('polling_error', (error) => {
            logger.error('Polling error:', error);
        });
    }

    start() {
        logger.info('Bot is starting...');
        this.bot.getMe().then((botInfo) => {
            logger.info(`Bot started successfully! Username: @${botInfo.username}`);
        }).catch((error) => {
            logger.error('Error starting bot:', error);
            process.exit(1);
        });
    }
}

module.exports = Bot;