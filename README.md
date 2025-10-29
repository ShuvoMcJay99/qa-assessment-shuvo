## Final Report
➡️ **[GoQuant QA Bootcamp – Phase 2 Final Report (PDF)](./GoQuant%20QA%20Bootcamp%20-%20Final%20Report.pdf)**

## How to Run
```bash
npm ci
npx playwright install
npx playwright test --project=chromium --project=firefox --project=webkit
npx playwright show-report



QA Bootcamp Automated Testing – GoQuant Assessment

Author: Shuvojeet Mukherjee

Repository: qa-assessment-shuvo

Owner: Shuvo (@<ShuvoMcJay99>)

Date init: Oct 25, 2025




## Project Overview

This repository contains a comprehensive Playwright-TypeScript automation suite designed to test the GoQuant trading dashboard – an intentionally unstable platform provided as part of the GoQuant QA Bootcamp.
The focus of this assessment is testing methodology, code quality, attention to detail, and problem-solving ability, rather than pure test pass rates.




## Tools & Frameworks

| Category        | Tool                                | Purpose                                     |
| --------------- | ----------------------------------- | ------------------------------------------- |
| Test Framework  | **Playwright (TypeScript)**         | End-to-end browser automation               |
| Test Runner     | **Playwright Test**                 | Parallel execution & multi-browser coverage |
| Browsers Tested | Chromium, Firefox, WebKit           | Cross-browser compatibility                 |
| Reporting       | HTML, JSON, Traces                  | For structured test result analysis         |
| Data Management | `users.json`, `exchanges.json`      | Dynamic test data feeding                   |
| Utilities       | Custom `helpers.ts`, `selectors.ts` | Modular reusable functions                  |
| Version Control | Git / GitHub                        | CI-ready, public repo submission            |



## Testing Strategy

1) Functional Coverage

✅ Login / Logout (valid, invalid, session persistence)

✅Two-Factor & Session Guards

✅ Exchange Selector & Market Data Validation

✅ Order Form Validations (Boundary / Negative / UI feedback)

✅ Profile & Settings Update

✅ Portfolio Load / Navigation

✅ Password & Auth Negative Tests

3) UI & UX
- Responsive layout validation
- Visibility & element readiness checks
- Graceful handling of async rendering delays

3) Edge & Boundary Testing
- Quantity limits (0, huge, fractional)
- Insufficient balance & invalid inputs
- Missing elements & intermittent backend failures

4) Cross-Browser Testing
- Executed on all three Playwright engines: Chromium, Firefox, and WebKit.
