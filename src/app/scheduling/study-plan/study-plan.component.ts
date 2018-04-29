import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { StudyPlan } from './study-plan';
import { Rating } from './star-rating/rating';
import { StudyPlanService } from './study-plan.service';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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

// allow jquery
declare const $: any;

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
  styleUrls: ['./study-plan.component.scss']
})
export class StudyPlanComponent implements OnInit {
  // routing parameters
  type: string;
  _id: String;
  profileUsername: string;

  // assign modal
  selectedUser: String;

  // user info
  currUsername: string;
  currIsChild: boolean;
  currIsAdmin: boolean;
  listOfChildren: any[];

  // study plan details
  studyPlan: StudyPlan;
  title: string;
  description: string;
  editorContent: SafeHtml;
  events: CalendarEvent[];
  createTitle = '';
  rating = 0;

  // copy utility
  tempStudyPlan: StudyPlan;

  // Calendar API view control
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();

  // datetime picker variables
  createStart = new Date();
  createEnd = new Date();
  editStart = new Date();
  editEnd = new Date();

  // edit modal control
  editIndex = 0;

  // modification control
  changed = false;
  editingDescription = false;
  editingTitle = false;

  // assign button binding
  assignFunction;
  assignText;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private studyPlanService: StudyPlanService,
    private router: Router, private _AuthService: AuthService) { }

  ngOnInit() {

    // datetime pickers
    $('.datetimepicker').bootstrapMaterialDatePicker({
      format: 'dddd DD MMMM YYYY - hh:mm a',
      shortTime: true,
      clearButton: true,
      weekStart: 6
    });

    let self = this;

    $('#createStart').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.createStart = date._d;
        $('#createEnd').bootstrapMaterialDatePicker('setMinDate', date);
      }
    });

    $('#createEnd').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.createEnd = date._d;
        $('#createStart').bootstrapMaterialDatePicker('setMaxDate', date);
      }
    });

    $('#editStart').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.editStart = date._d;
        $('#editEnd').bootstrapMaterialDatePicker('setMinDate', date);
      }
    });

    $('#editEnd').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.editEnd = date._d;
        $('#editStart').bootstrapMaterialDatePicker('setMaxDate', date);
      }
    });

    this.studyPlan = {
      creator: '',
      description: '',
      events: [],
      title: '',
      rating: {
        number: 0,
        sum: 0,
        value: 0
      }
    };
    this.description = '';
    this.editorContent = '';
    this.events = [];

    // fetch current user data for control
    this._AuthService.getUserData(['username', 'isChild', 'isAdmin', 'children']).subscribe((res) => {
      this.currUsername = res.data.username;
      this.currIsChild = res.data.isChild;
      this.currIsAdmin = res.data.isAdmin;
      this.listOfChildren = res.data.children;
    });
    // fetch routing data
    this.route.params.subscribe(params => {
      this.type = params.type;
      this._id = params.id;
      this.profileUsername = params.username;
    });

    // fetch study plan according to its type
    if (this.type === 'personal') {
      this.studyPlanService.getPersonalStudyPlan(this.profileUsername, this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.title = this.studyPlan.title;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          this.editorContent = this.sanitizer.bypassSecurityTrustHtml(this.description);
          this.assignFunction = this.studyPlan.assigned ? this.unAssign : this.assign;
          this.assignText = this.studyPlan.assigned ? 'Unassign' : 'Assign';
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    } else {
      this.studyPlanService.getPublishedStudyPlan(this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.title = this.studyPlan.title;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          this.rating = this.studyPlan.rating.value;
          this.editorContent = this.sanitizer.bypassSecurityTrustHtml(this.description);
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    }
  }

  publish(): void {
    /*
     @author: Ola
     Here , I am just calling the PublishStudyPlan method in studyPlanService an dpassing to it the
     studyPlan I want to publish if the response is that studyPlan published i will redirect to
     the published studyPlans else i will return the error message
    */
    this.studyPlan._id = undefined;
    this.studyPlanService.PublishStudyPlan(this.studyPlan).subscribe(
      res => {
        if (res.err) {
          alert(res.err);
        } else {
          alert(res.msg);
          this.router.navigate(['/scheduling/study-plan/published']);
        }
      });
  }

  copy(): void {
    this.tempStudyPlan = this.studyPlan;
    this.tempStudyPlan._id = undefined;
    this.studyPlanService
      .createStudyPlan(this.tempStudyPlan)
      .subscribe(res => {
        alert(res.msg);
      });
  }

  assign = function () {
    // this.studyPlan.assigned = true;
    this.studyPlanService.assignStudyPlan(this.selectedUser, this._id).subscribe(
      res => {
        if (res.msg === 'Study plan assigned successfully') {
          alert(res.msg);
          this.refreshDocument();
        } else {
          alert('An error occured while assigning the study plan');
        }
      });

  };

  unAssign = function () {
    // this.studyPlan.assigned = false;
    this.studyPlanService.unAssignStudyPlan(this.profileUsername, this._id).subscribe(
      res => {
        if (res.msg === 'Study plan unassigned successfully') {
          alert(res.msg);
          this.refreshDocument();
        } else {
          alert('An error occured while Unassigning the study plan from me');
        }
      });
  };

  edit(): void {
    this.router.navigate(['/scheduling/study-plan/edit/edit/' + this.studyPlan._id + '/' + this.profileUsername]);
  }

  // Calendar API control methods

  // calendar header change handler
  headerChange(): void {
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

  // day click handler
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

  // new event creation handler
  createEvent(eventTitle: string, eventDescription: string, eventStart: Date, eventEnd: Date) {
    this.events.push({
      title: eventTitle,
      start: eventStart,
      end: eventEnd,
      color: {
        primary: '#2196f3',
        secondary: '#D1E8FF'
      },
      draggable: false,
      meta: {
        description: eventDescription ? eventDescription : ''
      }
    });

    $('#createStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#createEnd').bootstrapMaterialDatePicker('_onClearClick');

    this.changed = true;

    this.refresh.next();
  }

  // clear date pickers in event creation modal on cancellation
  cancelCreate() {
    $('#createStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#createEnd').bootstrapMaterialDatePicker('_onClearClick');
  }

  // set date picker values to the values of the event to be edited
  preEdit(index) {
    $('#editStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#editEnd').bootstrapMaterialDatePicker('_onClearClick');
    $('#editStart').bootstrapMaterialDatePicker('setDate', this.events[index].start);
    $('#editEnd').bootstrapMaterialDatePicker('setDate', this.events[index].end);
  }

  // write updated event data
  editEvent(editTitle, editDescription, editStart, editEnd) {
    this.events[this.editIndex].title = editTitle;
    this.events[this.editIndex].meta.description = editDescription;
    this.events[this.editIndex].start = editStart;
    this.events[this.editIndex].end = editEnd;

    $('#editStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#editEnd').bootstrapMaterialDatePicker('_onClearClick');

    this.changed = true;

    this.refresh.next();
  }

  // delete corresponding event
  delete(index) {
    this.events.splice(index, 1);
    this.changed = true;
  }

  saveChangesPersonal(): void {
    if (!(this.title && this.description && this.events.length)) {
      alert('A Study Plan needs a title, a description, and at least one event.');
      return;
    }

    let targetUser = this.profileUsername ? this.profileUsername : this.currUsername;

    this.studyPlanService.editPersonalStudyPlan(targetUser, this._id, new StudyPlan(
      this.title,
      this.currUsername,
      this.events,
      this.description
    ))
      .subscribe(res => {
        if (res.err) {
          alert(res.err);
        } else {
          alert(res.msg);
          this.router.navigate(['/profile/' + targetUser]);
        }
      });
  }

  // utility
  refreshDocument() {
    // Light refresh to show any changes
    const self = this;
    setTimeout(function () {
      return self.refresh.next();
    }, 0);
  }
}
