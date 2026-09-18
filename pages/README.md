# OrangeHRM Playwright Test Automation Assessment

A production-grade End-to-End (E2E) automation testing framework for **OrangeHRM Open Source Demo** built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** architectural pattern.

---

## 🚀 Key Framework Features

* **Page Object Model (POM):** Clean separation of element locators and test actions across modular classes (`LoginPage`, `DashboardPage`, `PIMPage`, `AddEmployeePage`, `EmployeeDetailsPage`).
* **Full E2E Lifecycle Coverage:** Automated complete user workflows spanning UI interactions and backend network synchronizations.
* **Hybrid API & UI Validation:** Validates UI state transitions alongside direct REST API assertions utilizing authenticated browser context state (`page.request`).
* **Dynamic Test Data Handling:** Generates runtime unique identifiers (`EMP${Date.now()}`) to prevent data collisions during sequential test execution runs.
* **Asynchronous Event Handling:** Handles reactive framework DOM re-renders (`Vue.js`) by explicitly dispatching native DOM events and awaiting Network API responses.
* **Rich Reporting & Artifacts:** Automatic HTML test reports, failure screenshots, and execution video recordings.

---

## 🛠️ Tech Stack & Dependencies

* **Language:** TypeScript
* **Test Runner:** `@playwright/test`
* **Target Application:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/)
* **Node.js Environment:** Node.js (v18+)

---

## 📂 Project Structure

```text
OrangeHRM-Automation/
├── pages/                         # Page Object Model Classes
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── PIMPage.ts
│   ├── AddEmployeePage.ts
│   └── EmployeeDetailsPage.ts
├── tests/                         # E2E Test Specifications
│   └── e2e-employee-lifecycle.spec.ts
├── test-assets/                   # Test Upload Artifacts
│   └── profile.jpg
├── test-data/                     # Mock Data Inputs
│   └── employee.json
├── playwright.config.ts           # Playwright Framework Configurations
├── tsconfig.json                  # TypeScript Compiler Settings
├── package.json                   # Project Dependencies & Scripts
└── README.md                      # Project Documentation