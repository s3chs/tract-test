import {BasePage} from './BasePage';
import {expect} from '@playwright/test';
import {CustomerInfo} from "../types/CustomerInfo";

export class CheckoutPage extends BasePage {

    // Locators

    get emailInput() {
        return this.page.locator('input[name="username"]'); // Email
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

    // Actions

    async fillCustomerInformation(data: CustomerInfo) {
        await this.emailInput.fill(data.email);
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.streetAddressInput.fill(data.street);
        await this.cityInput.fill(data.city);
        await this.postcodeInput.fill(data.postcode);
        await this.countrySelect.selectOption({ label: data.country });
        await this.phoneInput.fill(data.phone);
    }

}
