/*
    Activity classes to help with creating
    and retreiving activities

    @author: Wessam
*/

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
    discussion: any[];
}

export class ActivityCreate {
    name: String;
    description: String;
    price: Number;
    // variables to put the dates from the user in
    fromDateN: Date;
    toDateN: Date;
    // variables to send to the server
    fromDateTime: Number;
    toDateTime: Number;
    image: String;
    discussion: any[];
}
