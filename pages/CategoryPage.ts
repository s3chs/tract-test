import {expect, Locator, Page} from '@playwright/test';
import {BasePage} from './BasePage';
import {ProductFilters} from "../types/Product";

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

    // Actions

    filterTab(filterName: string) {
        return this.page.locator('div.filter-options-title', {hasText: filterName});
    }

    async goTo() {
        await super.goTo(this.categoryPath);
    }

    async selectFirstVisibleProduct() {
        await expect(this.firstVisibleProduct).toBeVisible();
        await this.firstVisibleProduct.click();
    }

    async applyFilters(filters: ProductFilters) {
        if (filters.size) {
            await this.applyFilter('Size', filters.size);
        }

        if (filters.color) {
            await this.applyFilter('Color', filters.color);
        }

        if (filters.price) {
            await this.applyFilter('Price', filters.price);
        }

        if (filters.ecoCollection) {
            await this.applyFilter('Eco Collection', filters.ecoCollection);
        }

        if (filters.activity) {
            await this.applyFilter('Activity', filters.activity);
        }
    }

    async applyFilter(filterName: string, value: string) {
        const tab = this.filterTab(filterName);
        await tab.click();

        const filterBlock = tab.locator('..').locator('.filter-options-content');

        switch (filterName.toLowerCase()) {
            case 'color':
                await this.applyColorFilter(filterBlock, value);
                break;
            case 'price':
                await this.applyPriceFilter(filterBlock, value);
                break;
            case 'eco collection':
                await this.applyEcoCollectionFilter(filterBlock, value);
                break;
            default:
                await this.applyTextFilter(filterBlock, value);
        }
    }

    async applyTextFilter(filterContent: Locator, value: string) {
        let option = filterContent.locator(`[option-label="${value}"]`).first();

        if (await option.count() === 0) {
            option = filterContent.locator(`a:has-text("${value}")`).first();
        }

        if (await option.count() === 0) {
            throw new Error(`Text filter "${value}" not found`);
        }

        await expect(option).toBeVisible({timeout: 5000});
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

    async applyEcoCollectionFilter(filterContent: Locator, value: string) {
        const option = filterContent.locator(`a:has-text("${value}")`).first();
        if (await option.count() === 0) {
            throw new Error(`Eco Collection option "${value}" not found`);
        }
        await option.click();
    }

    async expectUrlToContainParams(params: string[]) {
        await expect.poll(async () => {
            const url = this.page.url();
            return params.every(param => url.includes(param));
        }, {
            timeout: 5000,
            intervals: [500]
        }).toBe(true);

        const finalUrl = this.page.url();
        for (const param of params) {
            expect(finalUrl).toContain(param);
        }
    }

    async selectProductByName(productName: string) {
        const productLink = this.page.locator('.product-item-link', {hasText: productName}).first();
        await productLink.click();
    }


    async selectRandomVisibleProduct() {
        const productItems = this.page.locator('.product-item');

        await expect(productItems.first()).toBeVisible({timeout: 5000});

        const count = await productItems.count();

        if (count === 0) {
            throw new Error('No products are available on the page');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomProduct = productItems.nth(randomIndex);

        await expect(randomProduct).toBeVisible({timeout: 5000});
        await randomProduct.click();
    }
}
