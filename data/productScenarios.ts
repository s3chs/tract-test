import { ProductScenario } from '../types/ProductTypes';

export const scenario1: ProductScenario = {
    categoryPath: 'men/tops-men/jackets-men',
    filters: {
        size: 'XS',
        color: 'Blue',
        price: '$40.00 - $49.99',
    },
    attributes: {
        size: 'XS',
        color: 'Blue',
    },
    quantity: 2,
    coupon: '20poff',
    expectedUrlParams: ['size=166', 'color=50', 'price=40-50']
};

export const scenario2: ProductScenario = {
    categoryPath: 'women/tops-women/jackets-women',
    filters: {
        size: 'M',
        color: 'Red',
        ecoCollection: 'Yes'
    },
    attributes: {
        size: 'M',
        color: 'Red',
    },
    quantity: 2,
    coupon: '20poff',
    expectedUrlParams: ['size=168', 'color=58', 'eco_collection=1'],
    productName: 'Stellar Solar Jacket'
};

export const scenario3: ProductScenario = {
    categoryPath: 'gear/bags',
    filters: {
        activity: 'Yoga',
    },
    quantity: 1,
    coupon: '20poff',
    expectedUrlParams: ['activity=8']
};
