import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class ProductPage extends BasePage {

    // Locators
    get successMessage() {
        return this.page.locator('.message-success');
    }

    get addToCartButton() {
        return this.page.getByRole('button', { name: 'Add to Cart' });
    }

    get sizeOptions() {
        return this.page.locator('[option-label]');
    }

    get quantityInput() {
        return this.page.locator('input#qty');
    }

    // Actions
    async selectAttributes(size: string, color: string) {
        await this.page.locator(`[option-label="${size}"]`).click();
        await this.page.locator(`[option-label="${color}"]`).click();
    }

    async setQuantity(qty: number) {
        await this.quantityInput.fill('');
        await this.quantityInput.type(qty.toString());
    }

    async addToCart() {
        await this.addToCartButton.click();
    }

    async expectSuccessMessagetoBeVisible() {
        await expect(this.successMessage).toBeVisible();
    }
}
