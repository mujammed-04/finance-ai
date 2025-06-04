const logger = require('../services/logger');

class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = new Map();
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
                await handler(msg);
            } catch (error) {
                logger.error(`Error handling command ${command}:`, error);
                await this.bot.sendMessage(msg.chat.id, 'Sorry, something went wrong while processing your command.');
            }
        }
    }
}

module.exports = CommandHandler; 