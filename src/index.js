require('dotenv').config();
const Bot = require('./bot');
const logger = require('./services/logger');
const database = require('./services/database');

async function main() {
    try {
        // Check for required environment variables
        if (!process.env.BOT_TOKEN) {
            throw new Error('BOT_TOKEN is required in .env file');
        }

        // Initialize database
        database.initialize();

        // Create and start bot
        const bot = new Bot(process.env.BOT_TOKEN);
        await bot.start();
        
        logger.info('Bot started successfully');
    } catch (error) {
        logger.error('Failed to start bot:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    logger.info('Shutting down...');
    database.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Bot is shutting down...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

main(); 