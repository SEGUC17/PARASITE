export interface Content {
    _id?: String;
    approved?: Boolean;
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
}
