const logger = require('../services/logger');

const commands = {
    start: async (bot, msg) => {
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, 'Welcome! I am your Telegram bot. How can I help you?');
        logger.info(`Start command executed by user ${msg.from.id}`);
    },

    help: async (bot, msg) => {
        const chatId = msg.chat.id;
        const helpText = 'Available commands:\n' +
            '/start - Start the bot\n' +
            '/help - Show this help message';
        await bot.sendMessage(chatId, helpText);
        logger.info(`Help command executed by user ${msg.from.id}`);
    }
};

module.exports = commands; 