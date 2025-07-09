import { BasePage } from './BasePage';
import { expect } from '@playwright/test';
import {ProductAttributes} from "../types/ProductTypes";

export class ProductPage extends BasePage {

    // Locators
    get successMessage() {
        return this.page.locator('.message-success');
    }

    get addToCartButton() {
        return this.page.getByRole('button', { name: 'Add to Cart' });
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
        await expect(this.successMessage).toBeVisible({ timeout: 8000 });
    }

    async verifyRequiredFieldErrors() {
        await expect(this.sizeIsRequiredErrorMessage).toBeVisible();
        await expect(this.colorIsRequiredErrorMessage).toBeVisible();
    }
}
