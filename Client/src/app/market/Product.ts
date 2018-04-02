export enum type {
    'rent',
    'sell',
    'rent/sell'
}

export class Product {
    _id: String;
    acquiringType: type;
    createdAt: Date;
    description: String;
    image: String;
    name: String;
    price: Number;
    // in days
    rentPeriod: Number;
    seller: String;
}
