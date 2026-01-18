# Playwright Framework (UI + API) - TypeScript

Test automation framework based on **Playwright + TypeScript**, covering **UI and API testing**, with clean architecture, environment management, reporting, and CI integration.

---

## Features

- ✅ UI testing (Playwright Test, Page Object Model)
- ✅ API testing (Playwright APIRequestContext)
- ✅ Single source of truth for environment configuration (`.env`, `.env.<env>`)
- ✅ HTML reports (local & CI)
- ✅ JUnit reports (CI, GitHub Actions Test Summary)
- ✅ ESLint + Prettier (code quality gate)
- ✅ Ready for GitHub Actions CI
- ✅ Separate UI / API projects

---

## Project structure

```text
.
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── README.md
│
├── src
│   ├── api
│   │   ├── clients
│   │   ├── models
│   │   └── services
│   ├── config
│   │   ├── env.loader.ts
│   │   └── env.ts
│   ├── pages
│   └── utils
│
├── tests
│   ├── ui
│   └── api
│
├── .github
│   └── workflows
│       └── ci.yml
│
├── .env.example
├── .env.ci
├── eslint.config.js
└── .prettierrc.json
```

---

## Environment configuration

### Environment strategy

- `.env` — local environment (not committed)
- `.env.<env>` — environment overlays (`ci`, `stage`, etc.)
- `TEST_ENV` defines which overlay is used

Load order:

1. `.env`
2. `.env.<TEST_ENV>` (overrides)

### Example

```bash
cp .env.example .env
TEST_ENV=ci npm run test:api
```

---

## How to run

### Prerequisites

- Node.js **20+**
- npm **9+**

---

### 1) Setup (first time)

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env
```

---

### 2) Run tests locally

#### UI tests

```bash
npm run test:ui
```

Run with visible browser:

```bash
npm run test:ui -- --headed
```

Debug mode:

```bash
npm run test:ui -- --debug
```

---

#### API tests

```bash
npm run test:api
```

Run with environment overlay:

```bash
TEST_ENV=ci npm run test:api
```

---

### 3) Reports

Open the last HTML report:

```bash
npm run report
```

Generated files (not committed):

- `playwright-report/`
- `test-results/`

---

### 4) Code quality

Lint:

```bash
npm run lint
```

Format (apply changes):

```bash
npm run format
```

Format (check only):

```bash
npm run format:check
```

---

### 5) Clean project (remove generated artifacts)

```bash
npm run clean
```

Remove everything including dependencies:

```bash
npm run clean:all
```

---

## CI (GitHub Actions)

CI pipeline is configured via:

```text
.github/workflows/ci.yml
```

Pipeline flow:

1. Lint & formatting check
2. UI tests
3. API tests
4. HTML report upload
5. JUnit test summary in GitHub UI

CI uses:

- `.env.ci`
- `CI=true`
- `TEST_ENV=ci`

---

## Reports in CI

- **HTML report** — uploaded as artifact (`playwright-report-*`)
- **JUnit report** — parsed into GitHub Actions Test Summary

---

## What is NOT committed to the repository

The following are generated artifacts and are ignored by git:

- `node_modules/`
- `playwright-report/`
- `test-results/`
- `blob-report/`
- `.env`
- `.env.*` (except `.env.example`, `.env.ci`)

---

## Scripts summary

```bash
npm run test          # run all tests
npm run test:ui       # run UI tests
npm run test:api      # run API tests

npm run lint          # eslint check
npm run format        # apply prettier formatting
npm run format:check  # check formatting only

npm run report        # open HTML report
npm run clean         # remove generated artifacts
npm run clean:all     # full cleanup (including node_modules)
```

---

## Notes

- UI and API configurations are isolated via Playwright projects.
- Reporters are environment-aware:
  - local → HTML
  - CI → JUnit + HTML
- ESLint and Prettier are enforced in CI before tests.

---

## Before commit files:

npm run format:check
npm run lint                                             
npm run typecheck

---
