<<<<<<< HEAD
export class Content {
    id: String;
    title: String;
    contentImage: String;
    creatorUsername: String;
    creatorProfileLink: String;
    creatorAvatar: String;
    tags: String[];
=======
export interface Content {
    _id?: String;
    approved: Boolean;
    body: String;
    category: String;
    creator: String;
    creatorAvatarLink: String;
    creatorProfileLink: String;
    image?: String;
    section: String;
    tags?: String[];
    title: String;
    touchDate?: Date;
    type: String;
    update?: String;
    video?: String;
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
}
