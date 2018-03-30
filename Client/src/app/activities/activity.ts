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