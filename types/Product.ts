export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type Color = 'Blue' | 'Red' | 'Green' | 'Black' | 'White';
export type PriceRange = '$40.00 - $49.99' | '$50.00 - $59.99' | '$60.00 - $69.99' | '$70.00 - $79.99';
export type Activity = 'Yoga' | 'Running' | 'Hiking';
export type EcoCollection = 'Yes' | 'No';

export interface ProductAttributes {
    size?: Size;
    color?: Color;
    activity?: Activity;
    priceRange?: PriceRange;
    ecoCollection?: EcoCollection;
}

export interface ProductFilters extends ProductAttributes {
    price?: PriceRange;
}

export interface ProductScenario {
    categoryPath: string;
    filters?: ProductFilters;
    attributes?: ProductAttributes;
    quantity?: number;
    coupon?: string;
    expectedUrlParams?: string[];
    productName?: string
}
