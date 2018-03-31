export class Activity {
    _id : String;
    name : String;
    description : String;
    bookedBy : [String]; // userIds
    price : Number;
    status : String;
    fromDateTime : Date;
    toDateTime : Date;
    createdAt : Date;
    updatedAt : Date;
    image : String;
}

export class ActivityCreate {
    name: String;
    description: String;
    price: Number;
    fromDateTime: Date;
    toDateTime: Date;
    image: String;
}