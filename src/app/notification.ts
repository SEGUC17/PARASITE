export interface Notification {
    _id?: string;
    isRead?: Boolean;
    date: Date;
    body: string;
    itemId ?: string;
    itemUsername ?: string;
    type: string
}
