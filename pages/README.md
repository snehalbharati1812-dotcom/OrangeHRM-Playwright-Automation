# OrangeHRM Playwright Test Automation Framework

An enterprise-grade, end-to-end test automation framework built with Playwright, TypeScript, and Page Object Model (POM) architecture.

## 🏗️ Architecture & Key Features
* **Page Object Model (POM)**: Decouples page locators and interaction mechanisms from test scripts.
* **Environment-Based Configuration**: Uses `dotenv` for secret isolation across staging/production environments.
* **Custom Fixtures**: Manages session state (`authenticatedAdminPage`) and automated post-test resource teardown.
* **Hybrid UI + API Verification**: Validates UI state transitions against server endpoints using `expect.poll()`.
* **Role-Based Access Control (RBAC)**: Enforces permission boundary checks across Admin and restricted roles.
* **Parallel Execution & Sharding**: Optimized for fast CI runs using GitHub Actions matrix sharding.

## 📁 Repository Structure
```text
├── .github/workflows/   # CI/CD pipeline definition with sharding
├── fixtures/            # Custom Playwright fixtures (authentication & cleanup)
├── pages/               # Page Object Model classes extending BasePage
├── test-data/           # Test fixtures and static data definitions
├── tests/               # Tagged end-to-end test spec suites
├── utils/               # Shared utilities (API Client, helper modules)
├── .env.example         # Environment template
├── playwright.config.ts # Global execution and multi-reporter setup
└── README.md            # Framework documentation