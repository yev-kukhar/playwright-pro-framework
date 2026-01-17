# Playwright TypeScript Framework (UI + API)

Automation framework for UI and API testing built with **Playwright** and **TypeScript**. Supports reporting via **Playwright HTML** (default) or **Allure**.

## Project structure

```text
playwright-pro-framework/
├── src/
│   ├── api/
│   │   ├── clients/
│   │   │   └── base.client.ts          # Base HTTP client
│   │   ├── models/
│   │   │   └── privatbank.model.ts     # TypeScript models
│   │   └── services/
│   │       └── privatbank.service.ts   # PrivatBank API service
│   ├── data/                           # Test data
│   ├── fixtures/                       # Shared fixtures
│   ├── pages/                          # Page Objects (UI)
│   └── utils/                          # Utilities
├── tests/
│   ├── api/                            # API tests
│   │   └── privatbank.spec.ts
│   └── ui/                             # UI tests
├── .env                                # Local environment variables
├── .env.example                        # Environment template
├── playwright.config.ts                # Playwright config
├── tsconfig.json                       # TypeScript config
└── package.json                        # Dependencies and scripts
```

## Requirements

- Node.js 18+
- npm 9+
- Allure (optional, only if you want Allure reports)

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd playwright-pro-framework
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Example `.env`:

```bash
# PrivatBank API Base URL
API_BASE_URL=https://api.privatbank.ua

# UI Base URL
BASE_URL=https://www.saucedemo.com

# Reporter: playwright | allure
REPORTER=playwright

# Any custom env label
TEST_ENV=production
```

## Running tests

### Default run (all tests)

```bash
npm test
```

### Run only API tests

```bash
npm run test:api
```

### Run only UI tests

```bash
npm run test:ui
```

### Headed / UI mode / Debug

```bash
npm run test:headed
npm run test:ui-mode
npm run test:debug
```

## Reports

### Playwright HTML report (default)

Run tests:

```bash
npm test
```

Open the report:

```bash
npm run report
```

### Allure report

1. Install Allure (one-time, optional)

macOS:

```bash
brew install allure
```

Windows (Scoop):

```bash
scoop install allure
```

Linux (Ubuntu example):

```bash
sudo apt-add-repository ppa:qameta/allure
sudo apt-get update
sudo apt-get install allure
```

2. Run tests with Allure reporter:

```bash
npm run test:allure
```

3. Generate and open the report:

```bash
npm run allure:generate
npm run allure:open
```

Or serve report directly:

```bash
allure serve allure-results
```

## Switching reporters

### Option 1: via `.env`

```bash
# .env
REPORTER=playwright
# or
REPORTER=allure
```

Then run:

```bash
npm test
```

### Option 2: via command line

```bash
REPORTER=playwright npm test
REPORTER=allure npm test
```

## What is covered

### PrivatBank API endpoints

- Current exchange rates
  - `GET /p24api/pubinfo?exchange&coursid=5` (cash)
  - `GET /p24api/pubinfo?exchange&coursid=11` (non-cash)
- Historical exchange rates
  - `GET /p24api/exchange_rates?date=DD.MM.YYYY`
  - `GET /p24api/pubinfo?exchange&coursid=5&date=DD.MM.YYYY`

### Test types

- Functional (schema/structure, data validation)
- Business rules (buy rate < sell rate)
- Performance (response time)
- Parallel requests
- Error handling

## Usage examples

### API test example

```ts
import { test, expect } from '@playwright/test';
import { PrivatBankService } from '../../src/api/services/privatbank.service';
import { CurrencyCode } from '../../src/api/models/privatbank.model';

test('should get USD rate', async ({ request }) => {
  const privatBank = new PrivatBankService(request);
  const usdRate = await privatBank.getCurrencyRate(CurrencyCode.USD);

  expect(usdRate).toBeDefined();
  expect(usdRate?.ccy).toBe('USD');
});
```

### Creating a new API service

```ts
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
```

## Cleanup

```bash
npm run clean
```

Allure only:

```bash
npm run allure:clean
```

## Output directories

- `playwright-report/` — Playwright HTML report
- `test-results/` — JSON and JUnit output
- `allure-results/` — raw Allure results
- `allure-report/` — generated Allure report

## Useful links

- Playwright documentation: https://playwright.dev/docs/intro
- Allure documentation: https://docs.qameta.io/allure/
- TypeScript handbook: https://www.typescriptlang.org/docs/
- PrivatBank API reference: https://api.privatbank.ua/

## Contributing

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/new-tests
```

3. Commit changes:

```bash
git commit -m "Add new tests"
```

4. Push the branch:

```bash
git push origin feature/new-tests
```
