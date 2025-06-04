require('dotenv').config();

module.exports = {
    bot: {
        token: process.env.BOT_TOKEN,
        options: {
            polling: true
        }
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
}; 