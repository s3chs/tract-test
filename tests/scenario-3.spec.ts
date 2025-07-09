import {test} from '@playwright/test';
import {CategoryPage} from '../pages/CategoryPage';
import {ProductPage} from "../pages/ProductPage";
import {CheckoutPage} from "../pages/CheckoutPage";
import {validCustomerNetherlands} from "../data/customerData";
import {scenario3} from "../data/productScenarios";

test.describe('Scenario 3 - End-to-end purchase flow from category to checkout', () => {

    test('should filter yoga bags, add a random product to cart, retry if the product is not available, and apply discount on checkout', async ({page}) => {

        // Instantiate the CategoryPage with the direct category URL path
        const categoryPage = new CategoryPage(page, scenario3.categoryPath);

        // Instantiate Google ad watcher
        categoryPage.startGoogleAdWatcher();

        // Navigate directly to the category page
        await categoryPage.goTo();

        // Handle the consent popup if it appears
        await categoryPage.handlePopupIfPresent();

        // Apply filters
        await categoryPage.applyFilters(scenario3.filters);
        await categoryPage.expectUrlToContainParams(scenario3.expectedUrlParams);

        // Select a random visible product on the category page
        await categoryPage.selectRandomVisibleProduct();

        // Kill the Google ad watcher
        categoryPage.stopGoogleAdWatcher();

        // Instantiate the ProductPage now that we are on the product detail page
        const productPage = new ProductPage(page);

        // Add the product to the cart
        await productPage.tryAddToCartWithRetry(categoryPage);

        // Navigate to the checkout page
        await productPage.navigateToCheckoutPage();

        // Instantiate the CheckoutPage now that we are on the checkout page
        const checkoutPage = new CheckoutPage(page);

        // Fill in the checkout form with valid customer data
        await checkoutPage.fillCustomerInformation(validCustomerNetherlands);

        // Wait for any loading indicators to appear and then disappear
        await checkoutPage.waitForLoaderToAppearAndDisappear();

        // Click the 'Next' button to proceed in the checkout flow
        await checkoutPage.clickNextButton();

        // Apply a coupon code to the order
        await checkoutPage.applyDiscountCode(scenario3.coupon);

        // Verify that a 20% discount is applied
        await checkoutPage.expectDiscountToBeApplied(20);

        // Verify that the total price reflects the discount correctly
        await checkoutPage.expectTotalToBeCorrect();

        // Kill the Google ad watcher
        await categoryPage.stopGoogleAdWatcher();
    });
});
