import { BASE_URL } from '../config/env';
import { Page } from '@playwright/test';
import { FinalSection, MainSection, SubSection } from "../utils/MenuEnums";

export class BasePage {
    protected page: Page;
    readonly baseURL: string;

    constructor(page: Page) {
        this.page = page;
        this.baseURL = BASE_URL;
    }

    // Locators

    get popupAcceptButton() { return this.page.locator('.fc-button:has-text("Consent")');
    }

    get mainMenuSection() {
        return (section: string) => this.page.locator(`text=${section}`);
    }

    get cartSummaryButton() {
        return this.page.locator('.minicart-wrapper');
    }

    get cartPageRedirectionButton() {
        return this.page.locator('a.action.viewcart', { hasText: 'View and Edit Cart' });
    }

    get checkoutPageRedirectionButton() {
        return this.page.locator('#top-cart-btn-checkout');
    }

    // Actions

    async navigateToHome() {
        await this.page.goto(this.baseURL);
    }

    async navigateToSection(mainSection: MainSection, subSection?: SubSection, finalSection?: FinalSection) {
        await this.mainMenuSection(mainSection).hover();
        if (subSection) await this.mainMenuSection(subSection).hover();
        if (finalSection) await this.mainMenuSection(finalSection).click();
    }

    async goTo(path = '') {
        const url = path.startsWith('/') ? `${this.baseURL}${path}` : `${this.baseURL}/${path}.html`;
        await this.page.goto(url);
    }

    async handlePopupIfPresent() {
        try {
            await this.popupAcceptButton.waitFor({ timeout: 5000 });
            await this.popupAcceptButton.click();
        } catch (e) {
        }
    }

    async navigateToCartPage() {
        await this.cartSummaryButton.click();
        await this.cartPageRedirectionButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.cartPageRedirectionButton.click();
    }

    async navigateToCheckoutPage() {
        await this.cartSummaryButton.click();
        await this.checkoutPageRedirectionButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.checkoutPageRedirectionButton.click();
    }
}