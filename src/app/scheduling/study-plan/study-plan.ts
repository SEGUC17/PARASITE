import { CalendarEvent } from 'calendar-utils';

export class StudyPlan {
    _id?: string;
    title: string;
    creator: string;
    events: CalendarEvent[];
    description: string;
    assigned?: boolean;
    published?: boolean;
    rating?: {
        number: number,
        sum: number,
        value: number
    };

    constructor(title: string, creator: string, events: CalendarEvent[], description: string) {
        this.title = title;
        this.creator = creator;
        this.events = events;
        this.description = description;
    }
}
