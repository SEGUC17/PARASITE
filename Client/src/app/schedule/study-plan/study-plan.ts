import { CalendarEvent } from 'calendar-utils';
import { Rating } from './star-rating/rating';

export class StudyPlan {
    _id?: String;
    title: String;
    creator: String;
    events: CalendarEvent[];
    description: any;
    assigned?: Boolean;
    published?: Boolean;
    rating?: Rating;
}
