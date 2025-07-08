import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {

    // Locators

    get orderTotalLocator() {
        return this.page.locator('td.amount[data-th="Order Total"] span.price');
    }

    get proceedToCheckoutButton() {
        return this.page.locator('button.action.primary.checkout');
    }

    get discountBlock() {
        return this.page.locator('#block-discount');
    }

    get couponCodeInput() {
        return this.page.locator('#coupon_code');
    }

    get applyDiscountButton() {
        return this.page.locator('button[value="Apply Discount"]');
    }

    get discountCouponMessage() {
        return this.page.locator('span.title', { hasText: 'Discount (Get flat 20% off on all products)' });
    }

    // Actions

    async getOrderTotal(): Promise<number> {
        const priceStr = await this.orderTotalLocator.textContent();
        if (!priceStr) throw new Error('Order total not found');
        const cleaned = priceStr.trim().replace('$', '');
        return parseFloat(cleaned);
    }

    calculateDiscountedPrice(total: number, discountPercent: number): number {
        return parseFloat((total * (1 - discountPercent / 100)).toFixed(2));
    }

    async applyCoupon(code: string) {
        await this.discountBlock.click();
        await this.couponCodeInput.fill('');
        await this.couponCodeInput.type(code);
        await this.applyDiscountButton.click();
    }

    async expectDiscountToBeApplied(expectedDiscountPercent: number, originalTotal: number) {
        await expect(this.discountCouponMessage).toBeVisible();
        await expect(this.discountCouponMessage).toHaveText('Discount (Get flat 20% off on all products)');

        const expectedTotal = this.calculateDiscountedPrice(originalTotal, expectedDiscountPercent);

        const discountedPriceStr = await this.orderTotalLocator.textContent();
        if (!discountedPriceStr) throw new Error('Discounted total not found');
        const cleaned = discountedPriceStr.trim().replace('$', '');
        const displayedDiscountedPrice = parseFloat(cleaned);

        expect(displayedDiscountedPrice).toBeCloseTo(expectedTotal, 2);
    }
}
