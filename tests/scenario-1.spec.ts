import { test } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { validCustomerNetherlands } from '../data/customerData';
import { scenario1 } from '../data/productScenarios';

test.describe('Scenario 1 - End-to-end purchase flow from category to checkout', () => {

    test('should allow a user to filter jackets, select a size/color, go to checkout and apply discount', async ({ page }) => {

        // Instantiate the CategoryPage with the direct category URL path
        const categoryPage = new CategoryPage(page, scenario1.categoryPath);

        // Instantiate Google ad watcher
        categoryPage.startGoogleAdWatcher();

        // Navigate directly to the category page
        await categoryPage.goTo();

        // Handle the consent popup if it appears
        await categoryPage.handlePopupIfPresent();

        // Apply filters
        await categoryPage.applyFilters(scenario1.filters);
        await categoryPage.expectUrlToContainParams(scenario1.expectedUrlParams);

        // Select the first visible product on the category page
        await categoryPage.selectFirstVisibleProduct();

        // Kill the Google ad watcher
        categoryPage.stopGoogleAdWatcher();

        // Instantiate the ProductPage now that we are on the product detail page
        const productPage = new ProductPage(page);

        // Choose product options and add the product to the cart
        await productPage.selectAttributes(scenario1.attributes);
        await productPage.setQuantity(scenario1.quantity ?? 1);
        await productPage.addToCart();

        // Verify the success message is visible after adding to cart
        await productPage.expectSuccessMessageToBeVisible();

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

        // Apply a discount code to the order
        await checkoutPage.applyDiscountCode(scenario1.coupon);

        // Verify that a 20% discount is applied
        await checkoutPage.expectDiscountToBeApplied(20);

        // Verify that the total price reflects the discount correctly
        await checkoutPage.expectTotalToBeCorrect();
    });
});
