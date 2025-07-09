import {BASE_URL} from '../config/env';
import {Page} from '@playwright/test';

export class BasePage {
    protected page: Page;
    readonly baseURL: string;
    private googleAdWatcherRunning = false;

    constructor(page: Page) {
        this.page = page;
        this.baseURL = BASE_URL;
    }

    // Locators

    get popupAcceptButton() {
        return this.page.locator('.fc-button:has-text("Consent")');
    }

    // Actions

    async goTo(path = '') {
        const url = path.startsWith('/') ? `${this.baseURL}${path}` : `${this.baseURL}/${path}.html`;
        await this.page.goto(url);
    }

    async navigateToCheckoutPage() {
        await this.page.goto(this.baseURL + "/checkout");
    }

    async navigateToCartPage() {
        await this.page.goto(this.baseURL + "/checkout/cart");
    }

    async handlePopupIfPresent() {
        try {
            await this.popupAcceptButton.waitFor({timeout: 5000});
            await this.popupAcceptButton.click();
        } catch (e) {
        }
    }

    async dismissGoogleAdIfPresent() {
        const frames = this.page.frames();
        let adsClosed = 0;

        for (const frame of frames) {
            try {
                const dismissButton = frame.locator('#dismiss-button');

                if (await dismissButton.isVisible({timeout: 3000})) {
                    await dismissButton.click({force: true});
                    adsClosed++;
                }

            } catch (err) {
            }
        }
    }

    startGoogleAdWatcher(interval = 2000, maxAttempts = 100) {
        if (this.googleAdWatcherRunning) return;

        this.googleAdWatcherRunning = true;
        let attempts = 0;

        const loop = async () => {
            while (this.googleAdWatcherRunning && attempts < maxAttempts) {
                await this.dismissGoogleAdIfPresent();
                try {
                    await this.page.waitForTimeout(interval);
                } catch (error) {
                    console.warn('Erreur dans waitForTimeout:', error);
                }
                attempts++;
            }
        };

        loop();
    }

    stopGoogleAdWatcher() {
        this.googleAdWatcherRunning = false;
    }

}