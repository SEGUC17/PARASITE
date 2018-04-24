export interface Content {
    _id?: string;
    approved?: Boolean;
    body: string;
    category: string;
    creator: string;
    creatorAvatarLink: string;
    creatorProfileLink: string;
    image?: string;
    language: string;
    section: string;
    tags?: string[];
    title: string;
    touchDate?: Date;
    type: string;
    update?: string;
    video?: string;
    discussion: any[];
}
