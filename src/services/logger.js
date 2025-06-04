const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const errorLogFile = path.join(logsDir, `error-${timestamp}.log`);
const combinedLogFile = path.join(logsDir, `combined-${timestamp}.log`);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: errorLogFile,
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: combinedLogFile
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

logger.info('Application started', {
    timestamp: new Date().toISOString(),
    logFiles: {
        error: errorLogFile,
        combined: combinedLogFile
    }
});

module.exports = logger; 