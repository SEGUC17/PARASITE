import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { StudyPlan } from './study-plan';
import { StudyPlanService } from './study-plan.service';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
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

  // user info
  currUsername: string;
  currIsChild: boolean;
  currIsAdmin: boolean;
  listOfChildren: any[];

  // study plan details
  studyPlan: StudyPlan;
  title: string;
  description: string;
  events: CalendarEvent[];
  rating;

  // editor
  public editorOut;
  public editorContent;
  private editorOptions = {
    placeholder: 'Enter the description for your study plan here.'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];

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
    private router: Router, private _AuthService: AuthService, private toastrService: ToastrService,
     private translate: TranslateService) { }

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

      // fetch routing data
      this.route.params.subscribe(params => {
        this.type = params.type;
        console.log('type' + this.type);
        this._id = params.id;
        this.profileUsername = params.username;
      });

      // fetch study plan according to its type
      if (this.type === 'personal') {
        this.studyPlanService.getPersonalStudyPlan(this.profileUsername, this._id)
          .subscribe(resStudyPlan => {
            this.studyPlan = resStudyPlan.data;
            this.title = this.studyPlan.title;
            this.events = this.studyPlan.events;
            this.description = this.studyPlan.description;
            this.editorContent = this.studyPlan.description;
            this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
            this.assignFunction = this.studyPlan.assigned ? this.unAssign : this.assign;
            this.assignText = this.studyPlan.assigned ? 'Unassign' : 'Assign';
            for (let index = 0; index < this.events.length; index++) {
              this.events[index].start = new Date(this.events[index].start);
              this.events[index].end = new Date(this.events[index].end);
            }
          });
      } else {
        this.studyPlanService.getPublishedStudyPlan(this._id)
          .subscribe(resStudyPlan => {
            this.studyPlan = resStudyPlan.data;
            this.title = this.studyPlan.title;
            this.events = this.studyPlan.events;
            this.description = this.studyPlan.description;
            this.editorContent = this.studyPlan.description;
            this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
            this.rating = this.studyPlan.rating.value;
            for (let index = 0; index < this.events.length; index++) {
              this.events[index].start = new Date(this.events[index].start);
              this.events[index].end = new Date(this.events[index].end);
            }
          });
      }

    });
  }

  publish(): void {
    /*
     @author: Ola
     Here , I am just calling the PublishStudyPlan method in studyPlanService an dpassing to it the
     studyPlan I want to publish if the response is that studyPlan published i will redirect to
     the published studyPlans else i will return the error message
    */
    this.studyPlanService.PublishStudyPlan(this.studyPlan).subscribe(
      res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else if (res.msg) {
          this.toastrService.success(res.msg);
        }
      });
  }

  copy(): void {
    this.tempStudyPlan = this.studyPlan;
    this.tempStudyPlan._id = undefined;
    this.studyPlanService
      .createStudyPlan(this.tempStudyPlan)
      .subscribe(res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else if (res.msg) {
          this.toastrService.success('Study plan copied successfully');
        }
      });
  }

  assign = function (selectedUser) {
    // this.studyPlan.assigned = true;
    this.studyPlanService.assignStudyPlan(selectedUser, this._id).subscribe(
      res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else if (res.msg) {
          this.toastrService.success(res.msg);
          if (this.currUsername === selectedUser) {
            this.studyPlan.assigned = true;
          }
        }
      });

  };

  unAssign = function () {
    // this.studyPlan.assigned = false;
    this.studyPlanService.unAssignStudyPlan(this.profileUsername, this._id).subscribe(
      res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else if (res.msg) {
          this.toastrService.success(res.msg);
          this.studyPlan.assigned = false;
          if (this.profileUsername && this.profileUsername !== this.currUsername) {
            this.router.navigate(['/profile/' + this.profileUsername]);
          }
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
      this.toastrService.warning('A study plan needs a title, a description, and at least one event.');
      return;
    }

    let targetUser = this.profileUsername ? this.profileUsername : this.currUsername;

    this.studyPlanService.editPersonalStudyPlan(targetUser, this._id, new StudyPlan(
      this.title,
      this.events,
      this.description
    ))
      .subscribe(res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else {
          this.toastrService.success(res.msg);
          this.changed = false;
        }
      });
  }

  saveChangesPublished(): void {
    if (!(this.title && this.description && this.events.length)) {
      this.toastrService.warning('A study plan needs a title, a description, and at least one event.');
      return;
    }

    this.studyPlanService.editPublishedStudyPlan(this._id, new StudyPlan(
      this.title,
      this.events,
      this.description
    ))
      .subscribe(res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else {
          this.toastrService.success(res.msg);
          this.changed = false;
        }
      });
  }

  // editor chnage handler
  onContentChanged(quill) {
    this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    this.description = this.editorContent;
  }
}
