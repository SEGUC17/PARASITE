import { CalendarEvent } from 'calendar-utils';

export class StudyPlan {
    _id: String;
    title: String;
    creator: String;
    events: CalendarEvent[];
    description: any;
    assigned?: Boolean;
    published?: Boolean;
}
