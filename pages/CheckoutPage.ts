import {BasePage} from './BasePage';
import {CustomerInfo} from "../types/CustomerInfo";
import {expect} from "@playwright/test";

export class CheckoutPage extends BasePage {

    // Locators

    // Customer information

    get emailInput() {
        return this.page.locator('#customer-email:visible');
    }

    get firstNameInput() {
        return this.page.locator('input[name="firstname"]');
    }

    get lastNameInput() {
        return this.page.locator('input[name="lastname"]');
    }

    get streetAddressInput() {
        return this.page.locator('input[name="street[0]"]');
    }

    get cityInput() {
        return this.page.locator('input[name="city"]');
    }

    get postcodeInput() {
        return this.page.locator('input[name="postcode"]');
    }

    get countrySelect() {
        return this.page.locator('select[name="country_id"]');
    }

    get phoneInput() {
        return this.page.locator('input[name="telephone"]');
    }

    get nextStepButton() {
        return this.page.locator('button[data-role="opc-continue"]');
    }

    get shippingLoaderMask() {
        return this.page.locator('#opc-shipping_method > .loading-mask');
    }

    // Review & Payment

    get cartSubTotal() {
        return this.page.locator('tr.totals.sub td.amount span.price[data-th="Cart Subtotal"]');
    }

    get discountBlock() {
        return this.page.locator('#block-discount-heading');
    }

    get discountCodeInput() {
        return this.page.locator('#discount-code');
    }

    get applyDiscountButton() {
        return this.page.locator('button[value="Apply Discount"]');
    }

    get discountCouponMessage() {
        return this.page.locator('span.title', {hasText: 'Discount (Get flat 20% off on all products)'});
    }

    get discountAmountLocator() {
        return this.page.locator('tr:has-text("Discount (Get flat 20% off on all products)") td.amount');
    }

    get shippingFee() {
        return this.page.locator('tr.totals.shipping td.amount span.price');
    }

    get orderTotal() {
        return this.page.locator('tr.totals.grand td.amount span.price');
    }

    // Actions

    async fillCustomerInformation(data: CustomerInfo) {
        await this.emailInput.fill(data.email);
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.streetAddressInput.fill(data.street);
        await this.cityInput.fill(data.city);
        await this.postcodeInput.fill(data.postcode);
        await this.countrySelect.selectOption({label: data.country});
        await this.phoneInput.fill(data.phone);
    }

    async waitForLoaderToAppearAndDisappear(bufferMs: number = 1000) {
        try {
            await this.shippingLoaderMask.waitFor({state: 'visible', timeout: 5000});
        } catch {
            return;
        }
        await this.shippingLoaderMask.waitFor({state: 'hidden', timeout: 10000});
        await this.page.waitForTimeout(bufferMs);
    }

    async clickNextButton() {
        await this.nextStepButton.click();
    }

    async getShippingFee(): Promise<number> {
        const shippingText = await this.shippingFee.textContent();
        if (!shippingText) return 0;
        const cleaned = shippingText.trim().replace('$', '');
        return parseFloat(cleaned);
    }

    async getOrderTotal(): Promise<number> {
        const totalText = await this.orderTotal.textContent();
        if (!totalText) throw new Error('Order total not found');
        const cleaned = totalText.trim().replace('$', '');
        return parseFloat(cleaned);
    }

    async getCartSubtotal(): Promise<number> {
        const priceStr = await this.cartSubTotal.textContent();
        if (!priceStr) throw new Error('Cart subtotal not found');
        const cleaned = priceStr.trim().replace('$', '');
        return parseFloat(cleaned);
    }

    async getDiscountAmount(): Promise<number> {
        const discountText = await this.discountAmountLocator.textContent();
        if (!discountText) return 0;
        const cleaned = discountText.trim().replace('-$', '').replace('$', '');
        return parseFloat(cleaned);
    }

    async applyCoupon(code: string) {
        await this.discountBlock.click();
        await this.discountCodeInput.fill('');
        await this.discountCodeInput.type(code);
        await this.applyDiscountButton.click();
    }

    async expectDiscountToBeApplied(expectedDiscountPercent: number) {
        await expect(this.discountCouponMessage).toBeVisible();

        const subtotal = await this.getCartSubtotal();
        const expectedDiscount = parseFloat((subtotal * (expectedDiscountPercent / 100)).toFixed(2));
        const actualDiscount = await this.getDiscountAmount();

        expect(actualDiscount).toBeCloseTo(expectedDiscount, 2);
    }

    async expectSubtotalToMatch(expectedSubtotal: number) {
        const actualSubtotal = await this.getCartSubtotal();
        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
    }

    async expectTotalToBeCorrect() {
        const subtotal = await this.getCartSubtotal();
        const discount = await this.getDiscountAmount();
        const shipping = await this.getShippingFee();
        const expectedTotal = parseFloat((subtotal - discount + shipping).toFixed(2));
        const actualTotal = await this.getOrderTotal();

        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    }

}
