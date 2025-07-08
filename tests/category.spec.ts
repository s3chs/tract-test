import {test, expect} from '@playwright/test';
import {CategoryPage} from '../pages/CategoryPage';
import {ProductPage} from "../pages/ProductPage";
import {CartPage} from "../pages/CartPage";
import {CheckoutPage} from "../pages/CheckoutPage";
import {validCustomerNetherlands} from "../data/customerData";

test('Scenario 1 – Men > Tops > Jackets > XS > Blue', async ({page}) => {

    // Instantiate the CategoryPage with the direct category URL path
    const categoryPage = new CategoryPage(page, 'men/tops-men/jackets-men');

    // Navigate directly to the category page
    await categoryPage.goTo();

    // Click on the consent button of the pop-up
    await categoryPage.handlePopupIfPresent();

    // Apply filters: size XS, blue color and price range
    await categoryPage.applyFilter('Size', 'XS');
    await categoryPage.applyFilter('Color', 'Blue');
    await categoryPage.applyFilter("Price", "$40.00 - $49.99");
    await categoryPage.expectUrlToContainParams(['size=166', 'color=50', 'price=40-50']);

    // Select the first visible product
    await categoryPage.selectFirstVisibleProduct();

    // Instantiate the ProductPage now that we are on a product detail page
    const productPage = new ProductPage(page);

    // Verify that the URL indicates we are on the product page
    await expect(page).toHaveURL(/proteus-fitness-jackshirt/);

    // Select product options and add it to the cart
    await productPage.selectAttributes("XS", "Blue");
    await productPage.setQuantity(2);
    await productPage.addToCart();
    await productPage.expectSuccessMessagetoBeVisible();

    // Go to cart page
    await productPage.navigateToCartPage();

    // Instantiate the CartPage now that we are on the cart page
    const cartPage = new CartPage(page);

    // Total order amount before applying coupon
    const totalBeforeDiscount = await cartPage.getOrderTotal();

    // Apply coupon code
    await cartPage.applyCoupon("20poff");

    // Verify if the discount is applied correctly based on the original total
    await cartPage.expectDiscountToBeApplied(20, totalBeforeDiscount);

    // Click on the checkout button to be redirected to the checkout page
    await cartPage.proceedToCheckoutButton.click();

    // Instantiate the CheckoutPage now that we are on the checkout page
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillCustomerInformation(validCustomerNetherlands)

    await page.waitForTimeout(5000)
});
