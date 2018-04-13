import { CalendarEvent } from 'calendar-utils';
import { Rating } from './star-rating/rating';

export class StudyPlan {
    _id?: string;
    title: string;
    creator: string;
    events: CalendarEvent[];
    description: string;
    assigned?: Boolean;
    published?: Boolean;
    rating?: Rating;

    constructor(title: string, creator: string, events: CalendarEvent[], description: string) {
        this.title = title;
        this.creator = creator;
        this.events = events;
        this.description = description;
    }
}
