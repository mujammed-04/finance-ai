# Finance AI Telegram Bot

A Telegram bot built with Node.js that provides financial insights and assistance.

## Features

- Interactive command handling
- Comprehensive logging system using Winston
- Error handling and monitoring
- Development mode with hot-reload

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Telegram bot token:
```
BOT_TOKEN=your_bot_token_here
```

## Usage

### Development Mode
Run the bot with hot-reload enabled:
```bash
npm run dev
```

### Production Mode
Run the bot in production:
```bash
npm start
```

## Available Commands

- `/start` - Start the bot and get a welcome message
- `/help` - Display available commands and their descriptions

## Project Structure

```
finance-ai/
├── src/
│   ├── bot.js         # Main bot logic
│   └── logger.js      # Winston logger configuration
├── logs/              # Log files directory
│   ├── combined.log   # All logs
│   └── error.log      # Error logs only
├── .env              # Environment variables
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

## Logging

The bot uses Winston for logging with the following features:
- Console logging with colors
- File-based logging with rotation
- Separate error logs
- Timestamp and JSON formatting

Logs are stored in the `logs` directory:
- `combined.log`: Contains all logs
- `error.log`: Contains only error logs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the maintainers.
