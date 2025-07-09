import {BasePage} from './BasePage';
import {expect} from '@playwright/test';
import {ProductAttributes} from "../types/Product";
import {CategoryPage} from "./CategoryPage";

export class ProductPage extends BasePage {

    // Locators

    get addToCartButton() {
        return this.page.locator('#product-addtocart-button');
    }

    get quantityInput() {
        return this.page.locator('input#qty');
    }

    get sizeIsRequiredErrorMessage() {
        return this.page.locator('div.mage-error[for="super_attribute[143]"]');
    }

    get colorIsRequiredErrorMessage() {
        return this.page.locator('div.mage-error[for="super_attribute[93]"]');
    }

    get successMessage() {
        return this.page.locator('.message-success');
    }

    get outOfStockErrorMessage() {
        return this.page.locator('.message-error:has-text("The requested qty is not available")');
    }

    // Actions

    async selectAttributes(attributes: ProductAttributes) {
        if (attributes.size) {
            await this.page.locator(`[option-label="${attributes.size}"]`).click();
        }

        if (attributes.color) {
            await this.page.locator(`[option-label="${attributes.color}"]`).click();
        }
    }

    async setQuantity(qty: number) {
        await this.quantityInput.fill('');
        await this.quantityInput.type(qty.toString());
    }

    async addToCart() {
        await this.addToCartButton.click();
    }

    async expectSuccessMessageToBeVisible() {
        await expect(this.successMessage).toBeVisible({timeout: 8000});
    }

    async verifyRequiredFieldErrors() {
        await expect(this.sizeIsRequiredErrorMessage).toBeVisible();
        await expect(this.colorIsRequiredErrorMessage).toBeVisible();
    }

    async tryAddToCartWithRetry(categoryPage: CategoryPage, maxAttempts = 5): Promise<void> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {

            await this.addToCart();

            const successPromise = this.successMessage.waitFor({timeout: 5000}).then(() => 'success').catch(() => null);
            const errorPromise = this.outOfStockErrorMessage.waitFor({timeout: 5000}).then(() => 'error').catch(() => null);

            const result = await Promise.race([successPromise, errorPromise]);

            if (result === 'error') {
                await this.page.goBack();
                await categoryPage.selectRandomVisibleProduct();
                await this.dismissGoogleAdIfPresent();
                continue;
            }

            if (result === 'success') {
                return;
            }

            throw new Error("❌ No success or errors detected after trying to add a product to the cart");
        }

        throw new Error(`❌ Could not add a product to the cart after ${maxAttempts} retries`);
    }


}
