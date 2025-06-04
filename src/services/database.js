const Database = require('better-sqlite3');
const logger = require('./logger');
const path = require('path');

class DatabaseService {
    constructor() {
        this.db = null;
    }

    initialize() {
        try {
            const dbPath = path.join(process.cwd(), 'finance.db');
            this.db = new Database(dbPath);

            this.db.pragma('foreign_keys = ON');
            
            this.createTables();
            
            logger.info('Database initialized successfully');
        } catch (error) {
            logger.error('Error initializing database:', error);
            throw error;
        }
    }

    createTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT NOT NULL,
                currency TEXT NOT NULL,
                balance DECIMAL(15,2) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                wallet_id INTEGER,
                type TEXT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                category TEXT,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
            )
        `);

        logger.info('Database tables created successfully');
    }

    getWallets(userId) {
        const stmt = this.db.prepare('SELECT * FROM wallets WHERE user_id = ?');
        return stmt.all(userId);
    }

    createWallet(userId, name, currency) {
        const stmt = this.db.prepare('INSERT INTO wallets (user_id, name, currency) VALUES (?, ?, ?)');
        return stmt.run(userId, name, currency);
    }

    createDefaultWallet(userId) {
        const stmt = this.db.prepare('INSERT INTO wallets (user_id, name, currency) VALUES (?, ?, ?)');
        return stmt.run(userId, 'Наличка', 'KZT');
    }

    addTransaction(userId, walletId, type, amount, category, description) {
        const stmt = this.db.prepare(`
            INSERT INTO transactions (user_id, wallet_id, type, amount, category, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(userId, walletId, type, amount, category, description);
    }

    getTransactions(userId, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT t.*, w.name as wallet_name 
            FROM transactions t
            JOIN wallets w ON t.wallet_id = w.id
            WHERE t.user_id = ?
            ORDER BY t.created_at DESC
            LIMIT ?
        `);
        return stmt.all(userId, limit);
    }

    async resetUserData(userId) {
        try {
            const stmt1 = this.db.prepare('DELETE FROM transactions WHERE wallet_id IN (SELECT id FROM wallets WHERE user_id = ?)');
            const stmt2 = this.db.prepare('DELETE FROM wallets WHERE user_id = ?');

            this.db.transaction(() => {
                stmt1.run(userId);
                stmt2.run(userId);
            })();

            logger.info(`User data reset for user ${userId}`);
        } catch (error) {
            logger.error(`Error resetting user data for user ${userId}:`, error);
            throw error;
        }
    }

    close() {
        if (this.db) {
            this.db.close();
            logger.info('Database connection closed');
        }
    }
}

const database = new DatabaseService();
module.exports = database; 