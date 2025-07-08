import {test} from '@playwright/test';
import {CategoryPage} from '../pages/CategoryPage';
import {ProductPage} from "../pages/ProductPage";
import {CheckoutPage} from "../pages/CheckoutPage";
import {validCustomerNetherlands} from "../data/customerData";

test('Scenario 3 – Gear > Bags > Activity > Yoga', async ({ page }) => {

    // Instantiate the CategoryPage with the direct category URL path
    const categoryPage = new CategoryPage(page, 'gear/bags');

    // Navigate directly to the category page
    await categoryPage.goTo();

    // Handle the consent popup if it appears
    await categoryPage.handlePopupIfPresent();

    // Apply filters
    await categoryPage.applyFilter('Activity', 'Yoga');
    await categoryPage.expectUrlToContainParams(['activity=8']);

    // Select the first visible product on the category page
    await categoryPage.selectRandomVisibleProduct();

    // Instantiate the ProductPage now that we are on the product detail page
    const productPage = new ProductPage(page);

    // Add the product to the cart
    await productPage.addToCart();

    // Verify the success message is visible after adding to cart
    await productPage.expectSuccessMessagetoBeVisible();

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
    await checkoutPage.applyDiscountCode("20poff");

    // Verify that a 20% discount is applied
    await checkoutPage.expectDiscountToBeApplied(20);

    // Verify that the total price reflects the discount correctly
    await checkoutPage.expectTotalToBeCorrect();
});
