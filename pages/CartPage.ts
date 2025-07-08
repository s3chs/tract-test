import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {

    // Locators

    get orderTotal() {
        return this.page.locator('td.amount[data-th="Order Total"] span.price');
    }

    get discountBlock() {
        return this.page.locator('#block-discount');
    }

    get discountCodeInput() {
        return this.page.locator('#coupon_code');
    }

    get applyDiscountButton() {
        return this.page.locator('button[value="Apply Discount"]');
    }

    get discountCodeMessage() {
        return this.page.locator('span.title', { hasText: 'Discount (Get flat 20% off on all products)' });
    }

    // Actions

    async getOrderTotal(): Promise<number> {
        const priceStr = await this.orderTotal.textContent();
        if (!priceStr) throw new Error('Order total not found');
        const cleaned = priceStr.trim().replace('$', '');
        return parseFloat(cleaned);
    }

    calculateDiscountedPrice(total: number, discountPercent: number): number {
        return parseFloat((total * (1 - discountPercent / 100)).toFixed(2));
    }

    async applyDiscount(code: string) {
        await this.discountBlock.click();
        await this.discountCodeInput.fill('');
        await this.discountCodeInput.type(code);
        await this.applyDiscountButton.click();
    }

    async expectDiscountToBeApplied(expectedDiscountPercent: number, originalTotal: number) {
        await expect(this.discountCodeMessage).toBeVisible();
        await expect(this.discountCodeMessage).toHaveText('Discount (Get flat 20% off on all products)');

        const expectedTotal = this.calculateDiscountedPrice(originalTotal, expectedDiscountPercent);

        const discountedPriceStr = await this.orderTotal.textContent();
        if (!discountedPriceStr) throw new Error('Discounted total not found');
        const cleaned = discountedPriceStr.trim().replace('$', '');
        const displayedDiscountedPrice = parseFloat(cleaned);

        expect(displayedDiscountedPrice).toBeCloseTo(expectedTotal, 2);
    }
}
