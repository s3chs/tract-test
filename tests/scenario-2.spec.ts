import {expect, test} from '@playwright/test';
import {CategoryPage} from '../pages/CategoryPage';
import {ProductPage} from "../pages/ProductPage";
import {CheckoutPage} from "../pages/CheckoutPage";
import {validCustomerNetherlands} from "../data/customerData";
import {CartPage} from "../pages/CartPage";

test('Scenario 2 – Women > Tops > Jackets > Medium > Red', async ({page}) => {

    // Instantiate the CategoryPage with the direct category URL path
    const categoryPage = new CategoryPage(page, 'women/tops-women/jackets-women');

    // Navigate directly to the category page
    await categoryPage.goTo();

    // Handle the consent popup if it appears
    await categoryPage.handlePopupIfPresent();

    // Apply filters
    await categoryPage.applyFilter('Size', 'M');
    await categoryPage.applyFilter('Color', 'Red');
    await categoryPage.applyFilter('Eco Collection', 'Yes');
    await categoryPage.expectUrlToContainParams(['size=168', 'color=58', 'eco_collection=1']);

    // Select a product on the category page by its name
    await categoryPage.selectProductByName('Stellar Solar Jacket');

    // Instantiate the ProductPage now that we are on the product detail page
    const productPage = new ProductPage(page);

    // Add the product directly to the cart to generate errors
    await productPage.addToCart();
    await productPage.verifyRequiredFieldErrors();

    // Choose product options and add the product to the cart
    await productPage.selectAttributes("M", "Red");
    await productPage.setQuantity(4);
    await productPage.addToCart();

    // Verify the success message is visible after adding to cart
    await productPage.expectSuccessMessagetoBeVisible();

    // Go to cart page
    await productPage.navigateToCartPage();

    // Instantiate the CartPage now that we are on the cart page
    const cartPage = new CartPage(page);

    // Total order amount before applying coupon
    const totalBeforeDiscount = await cartPage.getOrderTotal();

    // Apply discount code
    await cartPage.applyDiscount("20poff");

    // Verify if the discount is applied correctly based on the original total, and store the total amount
    await cartPage.expectDiscountToBeApplied(20, totalBeforeDiscount);
    const discountedTotal = await cartPage.getOrderTotal();

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

    // Verify that the subtotal of the checkout page matches the total of the cart page without the shipping fee
    const totalExcludingShippingFee = await checkoutPage.getOrderTotalWithoutShipping();
    expect(discountedTotal).toBeCloseTo(totalExcludingShippingFee)
});
