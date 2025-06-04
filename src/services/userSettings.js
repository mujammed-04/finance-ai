const logger = require('./logger');
const languages = require('../config/languages');

class UserSettingsService {
    constructor() {
        this.userLanguages = new Map();
    }

    getLanguage(userId) {
        return this.userLanguages.get(userId) || 'en';
    }

    setLanguage(userId, language) {
        if (!languages[language]) {
            logger.error(`Invalid language: ${language}`);
            return false;
        }
        this.userLanguages.set(userId, language);
        logger.info(`Language set to ${language} for user ${userId}`);
        return true;
    }
}

const userSettings = new UserSettingsService();
module.exports = userSettings; 