# TRACT Technical Test – E2E Testing with Playwright

👋 Hello, and thank you for the opportunity to complete the technical test for **TRACT**.

This project includes the development and implementation of three end-to-end test scenarios using **Playwright with TypeScript**, along with additional edge cases, architectural choices, and stability improvements.

In order to run the tests, please use the "npx playwright test --headed" command as written in the scripts ! 
I focused on the use of the Chromium browser for this exercice.
Concerning the env, i created a fake env file in the data folder that would serve as containing the BASE_URL of the project.
---

## 🛠️ Technology Stack

- **Playwright** (E2E testing framework)
- **TypeScript**
- Page Object Model (POM) architecture

I chose this stack due to my hands-on experience and because TRACT is transitioning to Playwright, making this choice both relevant and strategic.

---

## 📁 Project Architecture

The project follows the **Page Object Model** design pattern for better maintainability, scalability, and readability.

### Core Structure:

- `BasePage`: Shared logic across all pages.
- `CategoryPage`: Product listing with filters.
- `ProductPage`: Product details (size, color, quantity selection).
- `CartPage`: Cart interaction + discount handling.
- `CheckoutPage`: Customer info input and order summary.

All **locators**, **actions**, and **assertions** are encapsulated within each page class.

---

## ✅ Test Scenarios

### 1. Men's Jackets – Full Customer Flow

#### Steps:
1. Navigate to men’s jackets category
2. Apply filters (size, color)
3. Select a product
4. Add to cart
5. Proceed to checkout
6. Fill customer info
7. Apply discount code

#### Key Features:
- URL parameter verification after filtering
- Product confirmation message assertion
- Loader detection during shipping country changes
- Price validation post-discount

---

### 2. Women’s Jackets – Alternate Paths + Bonuses

#### Steps:
1. Navigate to women’s jackets
2. Apply filters
3. Select product by name
4. Add with different attributes
5. Apply discount in **cart**
6. Proceed to checkout

#### Enhancements:
- Product selection by title
- Error detection on missing attributes
- Discount total validation across pages

---

### 3. Bags – Retry Logic + Google Ads Handling

#### Steps:
1. Go to bags category
2. Select and attempt to add a product
3. If out of stock, auto-retry with another product
4. Proceed to checkout
5. Apply discount and validate pricing

#### Unique Solutions:
- **Retry logic** for dynamic stock availability
- **Google Ad Watcher**:
    - Detects iframe-based ad popups
    - Auto-closes them without interrupting flow

---

## ⚠️ Challenges & Solutions

### 🌀 Shipping Loader Timing
- Issue: Flakiness due to async shipping updates
- Solution: Dynamic detection of loaders + buffer wait post-load

### 📦 Google Ads Interference
- Issue: Random iframe-based popups block interactions
- Solution: Background polling to detect and close ads dynamically

---

## ⚡ Performance Notes

Tests were resource-intensive but manageable on a typical development machine. Optimizations like dynamic waits and retries helped maintain stability and reliability.

---

## 🧠 Conclusion

This project demonstrates:
- Advanced usage of **Playwright**
- Clean, scalable test architecture
- Real-world problem solving (timing issues, flaky UI, 3rd-party ads)

I'm looking forward to discussing this work further. Thanks again for the opportunity!


