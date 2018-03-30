export interface Product {
    _id: String;
    acquiringType: String;
    createdAt: Date;
    description: String;
    image: String;
    name: String;
    price: Number;
    // in days
    rentPeriod: Number;
    seller: String;
}
