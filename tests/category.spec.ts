import {test} from '@playwright/test';
import {CategoryPage} from '../pages/CategoryPage';
import {ProductPage} from "../pages/ProductPage";
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
    // await categoryPage.applyFilter('Size', 'XS');
    // await categoryPage.applyFilter('Color', 'Blue');
    // await categoryPage.applyFilter("Price", "$40.00 - $49.99");
    // await categoryPage.expectUrlToContainParams(['size=166', 'color=50', 'price=40-50']);

    // Select the first visible product
    await categoryPage.selectFirstVisibleProduct();

    // Instantiate the ProductPage now that we are on a product detail page
    const productPage = new ProductPage(page);

    // Verify that the URL indicates we are on the product page
    // await expect(page).toHaveURL(/proteus-fitness-jackshirt/);

    // Select product options and add it to the cart
    await productPage.selectAttributes("XS", "Blue");
    await productPage.setQuantity(2);
    await productPage.addToCart();
    await productPage.expectSuccessMessagetoBeVisible();

    // Go to checkout page
    await productPage.navigateToCheckoutPage();

    // Instantiate the CheckoutPage now that we are on the checkout page
    const checkoutPage = new CheckoutPage(page);

    // Fill the checkout form with the customers information
    await checkoutPage.fillCustomerInformation(validCustomerNetherlands);

    await checkoutPage.waitForLoaderToAppearAndDisappear();

    await checkoutPage.clickNextButton();

    await page.waitForTimeout(8000)
    //
});
