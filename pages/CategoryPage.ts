import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
    readonly categoryPath: string;

    constructor(page: Page, categoryPath: string) {
        super(page);
        this.categoryPath = categoryPath;
    }

    // Locators

    get firstVisibleProduct() {
        return this.page.locator('.product-item').first();
    }

    filterTab(filterName: string) {
        return this.page.locator('div.filter-options-title', { hasText: filterName });
    }

    get filterContent() {
        return this.page.locator('.filter-options-content');
    }

    // Actions

    async goTo() {
        await super.goTo(this.categoryPath);
    }

    async selectFirstVisibleProduct() {
        await expect(this.firstVisibleProduct).toBeVisible();
        await this.firstVisibleProduct.click();
    }

    async applyFilter(filterName: string, value: string) {
        await this.filterTab(filterName).click();

        switch (filterName.toLowerCase()) {
            case 'color':
                await this.applyColorFilter(this.filterContent, value);
                break;
            case 'price':
                await this.applyPriceFilter(this.filterContent, value);
                break;
            default:
                await this.applyTextFilter(this.filterContent, value);
        }
    }

    async applyTextFilter(filterContent: Locator, value: string) {
        const option = filterContent.locator(`:scope :text("${value}")`).first();
        if (await option.count() === 0) throw new Error(`Text filter "${value}" not found`);
        await option.click();
    }

    async applyColorFilter(filterContent: Locator, value: string) {
        const option = filterContent.locator(`[option-label="${value}"]`).first();
        if (await option.count() === 0) throw new Error(`Color filter "${value}" not found`);
        await option.click();
    }

    async applyPriceFilter(filterContent: Locator, value: string) {
        const [minPrice, maxPrice] = value.split('-').map(v => v.trim());

        const options = filterContent.locator('li, div, a');

        const count = await options.count();

        for (let i = 0; i < count; i++) {
            const option = options.nth(i);

            const spans = option.locator('span.price');
            if (await spans.count() >= 2) {
                const firstSpanText = (await spans.nth(0).innerText()).trim();
                const secondSpanText = (await spans.nth(1).innerText()).trim();

                if (firstSpanText === minPrice && secondSpanText === maxPrice) {
                    await option.click();
                    return;
                }
            }
        }

        throw new Error(`Price filter "${value}" not found`);
    }

    async expectUrlToContainParams(params: string[]) {
        const url = this.page.url();
        for (const param of params) {
            expect(url).toContain(param);
        }
    }
}
