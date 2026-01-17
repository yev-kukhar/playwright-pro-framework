ʼАвтоматизований фреймворк для тестування API та UI ] з використанням Playwright, TypeScript та можливістю генерації звітів у Playwright HTML або Allure.

📁 Структура проекту
privatbank-api-tests/
├── src/
│   ├── api/
│   │   ├── clients/
│   │   │   └── base.client.ts          # Базовий HTTP клієнт
│   │   ├── models/
│   │   │   └── privatbank.model.ts     # TypeScript моделі
│   │   └── services/
│   │       └── privatbank.service.ts   # PrivatBank API сервіс
│   ├── data/                           # Тестові дані
│   ├── fixtures/                       # Fixtures для тестів
│   ├── pages/                          # Page Objects (для UI)
│   └── utils/                          # Утиліти
├── tests/
│   ├── api/
│   │   └── privatbank.spec.ts          # API тести
│   └── ui/                             # UI тести (якщо потрібні)
├── .env                                # Environment змінні
├── .env.example                        # Приклад environment
├── playwright.config.ts                # Конфігурація Playwright
├── tsconfig.json                       # Конфігурація TypeScript
└── package.json                        # Залежності
🚀 Встановлення
1. Клонуйте репозиторій
bash
git clone <your-repo-url>
cd privatbank-api-tests
2. Встановіть залежності
bash
npm install
3. Встановіть Allure (опціонально)
bash
# macOS
brew install allure

# Windows (через Scoop)
scoop install allure

# Linux
sudo apt-add-repository ppa:qameta/allure
sudo apt-get update
sudo apt-get install allure
4. Налаштуйте environment
bash
cp .env.example .env
Відредагуйте .env:

bash
API_BASE_URL=https://api.privatbank.ua
REPORTER=playwright  # або allure
TEST_ENV=production
🧪 Запуск тестів
Базові команди:
bash
# Запустити всі тести
npm test

# Запустити тільки API тести
npm run test:api

# Запустити конкретний файл
npm run test:specific

# UI режим
npm run test:ui
npm run test:ui -- --headed

# Debug режим
npm run test:debug
Тести з Playwright Reporter (за замовчуванням):
bash
# Запустити тести
npm test

# Відкрити звіт
npm run report
Тести з Allure Reporter:
bash
# 1. Встановити REPORTER=allure в .env
# АБО запустити напряму:

# Запустити тести з Allure
npm run test:allure

# Згенерувати Allure звіт
npm run allure:generate

# Відкрити Allure звіт
npm run allure:open

# АБО одразу відкрити (без генерації)
npm run allure:serve
📊 Перемикання між репортерами
Спосіб 1: Через .env файл
bash
# .env
REPORTER=playwright  # для Playwright HTML звітів
# або
REPORTER=allure      # для Allure звітів
bash
npm test
Спосіб 2: Через команду
bash
# Playwright Reporter
REPORTER=playwright npm test

# Allure Reporter
REPORTER=allure npm test
Спосіб 3: Використання NPM скриптів
bash
# Playwright
npm run report:html

# Allure
npm run test:allure
npm run allure:serve
🎯 Що тестується
PrivatBank API Endpoints:
Поточні курси валют
✅ GET /p24api/pubinfo?exchange&coursid=5 (готівка)
✅ GET /p24api/pubinfo?exchange&coursid=11 (безготівка)
Історичні курси
✅ GET /p24api/exchange_rates?date=DD.MM.YYYY
✅ GET /p24api/pubinfo?exchange&coursid=5&date=DD.MM.YYYY
Типи тестів:
✅ Функціональні (структура, валідація даних)
✅ Бізнес-логіка (купівля < продажу)
✅ Продуктивність (час відповіді)
✅ Паралельні запити
✅ Обробка помилок
📝 Приклад використання
У тесті:
typescript
import { test, expect } from '@playwright/test';
import { PrivatBankService } from '../../src/api/services/privatbank.service';
import { CurrencyCode } from '../../src/api/models/privatbank.model';

test('should get USD rate', async ({ request }) => {
  const privatBank = new PrivatBankService(request);
  const usdRate = await privatBank.getCurrencyRate(CurrencyCode.USD);
  
  expect(usdRate).toBeDefined();
  expect(usdRate?.ccy).toBe('USD');
});
Створення нового сервісу:
typescript
// src/api/services/mybank.service.ts
import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../clients/base.client';

export class MyBankService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, '/api/v1');
  }

  async getUsers(): Promise<User[]> {
    return this.get<User[]>('/users');
  }
}
🛠 Команди для очищення
bash
# Очистити всі звіти
npm run clean

# Очистити тільки Allure
npm run allure:clean
📈 Структура звітів
Playwright HTML Reporter:
📂 playwright-report/ - HTML звіт
📂 test-results/ - JSON та JUnit результати
Allure Reporter:
📂 allure-results/ - сирі результати
📂 allure-report/ - згенерований звіт
🔧 Налаштування TypeScript
tsconfig.json налаштований для:

✅ Strict mode (типобезпека)
✅ Path aliases (@api/*, @tests/*)
✅ ES2022 target
✅ CommonJS modules
🌟 Особливості
✅ Type-safe - повна типізація TypeScript
✅ Flexible reporting - Playwright HTML або Allure
✅ Service Layer - чиста архітектура
✅ Environment config - через .env
✅ Parallel execution - швидкі тести
✅ Detailed errors - зрозумілі повідомлення
📚 Корисні посилання
Playwright Documentation
Allure Framework
TypeScript Handbook
PrivatBank API
🤝 Contribution
Fork проект
Створіть feature branch (git checkout -b feature/new-tests)
Commit зміни (git commit -m 'Add new tests')
Push до branch (git push origin feature/new-tests)
Створіть Pull Request
📄 Ліцензія
MIT License

Автор: Your Name
Portfolio: [your-portfolio.com]
GitHub: [@yourusername]

