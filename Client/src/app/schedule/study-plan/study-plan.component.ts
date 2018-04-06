import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { StudyPlan } from './study-plan';
import { Rating } from './star-rating/rating';
import { StudyPlanService } from './study-plan.service';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  subDays,
  addDays,
  addHours
} from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-study-plan',
  templateUrl: './study-plan.component.html',
  styleUrls: ['./study-plan.component.css']
})
export class StudyPlanComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  // routing parameters
  type: String;
  _id: String;
  username: String;
  // end of routing parameters
  rating = 0;
  starCount = 5;
  starColor = 'primary';
  studyPlan: StudyPlan;
  description: String;
  view = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[];
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private studyPlanService: StudyPlanService,
    private router: Router) { }

  ngOnInit() {
    this.studyPlan = {
      creator: '',
      description: '',
      events: [],
      title: ''
    };
    this.description = '';
    this.events = [];
    this.route.params.subscribe(params => {
      this.type = params.type;
      this._id = params.id;
      this.username = params.username;
    });

    if (this.type === 'personal') {
      this.studyPlanService.getPersonalStudyPlan(this.username, this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    } else {
      this.studyPlanService.getPublishedStudyPlan(this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          if (this.studyPlan.rating) {
            this.rating = this.studyPlan.rating.value;
          }
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    }
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  onRatingChanged(rating) {
    this.rating = rating;
    this.studyPlanService.rateStudyPlan(this._id, rating).subscribe();
  }

  publish(): void {
    this.studyPlan._id = undefined;
    this.studyPlanService.PublishStudyPlan(this.studyPlan).subscribe(
      res => {
        if (res.msg === 'StudyPlan published successfully.') {
          alert(res.msg);
          this.router.navigate(['/published-study-plans']);
        } else {
          alert('An error occured while publishing the study plan, please try again.');
        }
      });
  }

  copy(): void {
    alert('Implement Copy Study Plan!');
  }

  assign(): void {
    alert('Implement Assign Study Plan!');
  }

  edit(): void {
    alert('Implement Edit Study Plan!');
  }

}
