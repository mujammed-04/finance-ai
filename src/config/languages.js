const languages = {
    en: {
        welcome: 'Welcome to Finance AI Bot! Please select your preferred language:',
        languageSelected: 'English language selected! 🇬🇧',
        changeLanguage: 'Select your preferred language:',
        features: 'Available features:',
        help: 'Use /help to see all available commands',
        commands: {
            start: 'Start the bot and get an overview of features',
            help: 'Show help information and available commands',
            wallets: 'List all wallets and their balances',
            addwallet: 'Create a new wallet',
            editwallet: 'Edit a wallet',
            expense: 'Add an expense transaction',
            income: 'Add an income transaction',
            report: 'Generate financial reports',
            settings: 'Manage personal settings',
            undo: 'Delete the last or specified transaction'
        },
        wallet: {
            customBtn: 'Custom Wallet',
            defaultWallet: 'Cash',
            defaultDeposit: 'Deposit',
            defaultCreated: 'Default wallet "Cash" has been created',
            chooseOrCreate: 'Choose a wallet type or create a custom one:',
            createPrompt: 'Enter wallet name:',
            createSuccess: 'Wallet created successfully!',
            createError: 'Error creating wallet. Please try again.',
            listEmpty: 'You have no wallets yet. Use /addwallet to create one.',
            listHeader: 'Your wallets:',
            listItem: '• {name} ({currency}): {balance}',
            nameTooShort: 'Wallet name must be at least 2 characters long.',
            nameTooLong: 'Wallet name must not exceed 32 characters.',
            names: {
                cash: 'Cash',
                deposit: 'Deposit'
            }
        },
        settings: {
            title: 'Settings',
            changeLanguage: 'Change Language',
            reset: 'Reset Data',
            selectLanguage: 'Select your preferred language:',
            confirmReset: 'Yes, Reset',
            cancelReset: 'Cancel',
            resetWarning: '⚠️ Warning: This will delete all your wallets and transaction history. This action cannot be undone. Are you sure?',
            resetSuccess: '✅ Your data has been reset successfully.',
            resetError: '❌ An error occurred while resetting your data. Please try again.',
            resetCancelled: 'Reset operation cancelled.'
        }
    },
    ru: {
        welcome: 'Добро пожаловать в Finance AI Bot! Пожалуйста, выберите предпочитаемый язык:',
        languageSelected: 'Выбран русский язык! 🇷🇺',
        changeLanguage: 'Выберите предпочитаемый язык:',
        features: 'Доступные функции:',
        help: 'Используйте /help для просмотра всех доступных команд',
        commands: {
            start: 'Запустить бота и получить обзор функций',
            help: 'Показать справочную информацию и доступные команды',
            wallets: 'Список всех кошельков и их балансов',
            addwallet: 'Создать новый кошелек',
            editwallet: 'Редактировать кошелек',
            expense: 'Добавить транзакцию расхода',
            income: 'Добавить транзакцию дохода',
            report: 'Создать финансовые отчеты',
            settings: 'Управление личными настройками',
            undo: 'Удалить последнюю или указанную транзакцию'
        },
        wallet: {
            customBtn: 'Свой кошелек',
            defaultWallet: 'Наличка',
            defaultDeposit: 'Депозит',
            defaultCreated: 'Создан кошелек по умолчанию "Наличка"',
            chooseOrCreate: 'Выберите тип кошелька или создайте свой:',
            createPrompt: 'Введите название кошелька:',
            createSuccess: 'Кошелек успешно создан!',
            createError: 'Ошибка при создании кошелька. Попробуйте снова.',
            listEmpty: 'У вас пока нет кошельков. Используйте /addwallet для создания.',
            listHeader: 'Ваши кошельки:',
            listItem: '• {name} ({currency}): {balance}',
            nameTooShort: 'Название кошелька должно содержать минимум 2 символа.',
            nameTooLong: 'Название кошелька не должно превышать 32 символа.',
            names: {
                cash: 'Наличка',
                deposit: 'Депозит'
            }
        },
        settings: {
            title: 'Настройки',
            changeLanguage: 'Изменить язык',
            reset: 'Сбросить данные',
            selectLanguage: 'Выберите предпочитаемый язык:',
            confirmReset: 'Да, сбросить',
            cancelReset: 'Отмена',
            resetWarning: '⚠️ Внимание: Это удалит все ваши кошельки и историю транзакций. Это действие нельзя отменить. Вы уверены?',
            resetSuccess: '✅ Ваши данные успешно сброшены.',
            resetError: '❌ Произошла ошибка при сбросе данных. Пожалуйста, попробуйте снова.',
            resetCancelled: 'Операция сброса отменена.'
        }
    },
    kk: {
        welcome: 'Finance AI Bot-қа қош келдіңіз! Өзіңізге ыңғайлы тілді таңдаңыз:',
        languageSelected: 'Қазақ тілі таңдалды! 🇰🇿',
        changeLanguage: 'Өзіңізге ыңғайлы тілді таңдаңыз:',
        features: 'Қолжетімді мүмкіндіктер:',
        help: 'Барлық қолжетімді командаларды көру үшін /help пайдаланыңыз',
        commands: {
            start: 'Ботты іске қосу және мүмкіндіктерді шолу',
            help: 'Анықтамалық ақпаратты және қолжетімді командаларды көрсету',
            wallets: 'Барлық әмияндарды және олардың баланстарын тізімдеу',
            addwallet: 'Жаңа әмиян құру',
            editwallet: 'Әмиян редактирлеу',
            expense: 'Шығын транзакциясын қосу',
            income: 'Табыс транзакциясын қосу',
            report: 'Қаржылық есептерді жасау',
            settings: 'Жеке параметрлерді басқару',
            undo: 'Соңғы немесе көрсетілген транзакцияны жою'
        },
        wallet: {
            customBtn: 'Өз әмияным',
            defaultWallet: 'Наличка',
            defaultDeposit: 'Депозит',
            defaultCreated: 'Әдепкі "Наличка" әмияны құрылды',
            chooseOrCreate: 'Әмиян түрін таңдаңыз немесе өзіңіздің әмияныңызды құрыңыз:',
            createPrompt: 'Әмиян атауын енгізіңіз:',
            createSuccess: 'Әмиян сәтті құрылды!',
            createError: 'Әмиян құру кезінде қате. Қайталап көріңіз.',
            listEmpty: 'Сізде әмиян жоқ. Құру үшін /addwallet пайдаланыңыз.',
            listHeader: 'Сіздің әмияндарыңыз:',
            listItem: '• {name} ({currency}): {balance}',
            nameTooShort: 'Әмиян атауы кемінде 2 таңба болуы керек.',
            nameTooLong: 'Әмиян атауы 32 таңбадан аспауы керек.',
            names: {
                cash: 'Наличка',
                deposit: 'Депозит'
            }
        },
        settings: {
            title: 'Баптаулар',
            changeLanguage: 'Тілді өзгерту',
            reset: 'Деректерді қалпына келтіру',
            selectLanguage: 'Үйреншікті тіліңізді таңдаңыз:',
            confirmReset: 'Иә, қалпына келтіру',
            cancelReset: 'Бас тарту',
            resetWarning: '⚠️ Ескерту: Бұл сіздің барлық әмияндарыңызды және транзакциялар тарихын жойып тастайды. Бұл әрекетті болдырмау мүмкін емес. Сіз сенімдісіз бе?',
            resetSuccess: '✅ Сіздің деректеріңіз сәтті қалпына келтірілді.',
            resetError: '❌ Деректерді қалпына келтіру кезінде қате орын алды. Қайталап көріңіз.',
            resetCancelled: 'Қалпына келтіру операциясы болдырмалды.'
        }
    }
};

module.exports = languages; 