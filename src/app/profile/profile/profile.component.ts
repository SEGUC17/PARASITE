/* tslint:disable-next-line:max-line-length */
/* tslint:disable */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../messaging/messaging.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TranslateService} from '@ngx-translate/core';

declare const swal: any;
declare const $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [AuthService, MessageService, ToastrService, DatePipe],
  encapsulation: ViewEncapsulation.None
})

export class ProfileComponent implements OnInit {

  reportReason: string;
  _this;
  // ---------- FLAGS --------------------
  // User Flags
  currIsOwner = false;
  currIsParent = false;
  currIsChild = false;
  currIsOfAge = false;
  currCanBeParent = false;
  currHasPP = false;
  currIsAdmin = false;

  visitedIsParent = false;
  visitedIsChild = false;
  visitedIsMyChild = false;
  visitedIsMyParent = false;
  visitedIsOfAge = false;
  visitedCanBeParent = false;
  visitedOld = true;
  visitedHasPP = false;
  visitedIsAdmin = false;
  // ------------------------------------

  // ---------- Current User Info ---------------
  user: any;
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  age: Number;
  email: string;
  address: string;
  phone: [string];
  schedule: any;
  studyPlans: any;
  birthday: Date;
  listOfChildren: any[];
  verified: Boolean = false;
  id: any;
  pws: { oldpw: '', newpw: '', confirmpw: '' };
  info: { address: '', birthdate: Date, email: '', firstName: '', lastName: '', phone: '', username: '' };
  birthdayView: string;

  // -------------------------------------

  // ---------Visited User Info-----------
  vUser: any;
  vAvatar: string;
  vFirstName: string;
  vLastName: string;
  vUsername: string;
  vAge: Number;
  vEmail: string;
  vAddress: string;
  vPhone: [string];
  vSchedule: any;
  vStudyPlans: any;
  vBirthday: Date;
  vListOfChildren: any[];
  vVerified: Boolean = false;
  vId: any;
  message: string;
  blocklist: any[];
  vBirthdayView: string;
  // ------------------------------------
  changePass: Boolean;
  childInfo: Boolean;
  personalInfo: Boolean;
  // ----------- Other Lists ------------
  listOfUncommonChildren: any[];
  listOfWantedVariables: string[] = ['_id', 'avatar', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
    'email', 'address', 'phone', 'birthdate', 'children', 'verified', 'isChild', 'isParent', 'blocked', 'isAdmin'];
  vListOfWantedVariables: string[] = ['_id', 'avatar', 'firstName', 'lastName', 'email',
    'address', 'phone', 'birthdate', 'children', 'verified', 'isChild', 'isParent', 'username', 'isAdmin'];
  // ------------------------------------
  // ------------ edited values ---------
  dFirstName: string;
  dLastName: string;
  dUsername: string;
  dEmail: string;
  dAddress: string;
  dPhone: string;
  dBirthday: Date;
  // ------------------------------------

  // study plan delete modal
  studyPlanIndex: number;

  constructor(private _ProfileService: ProfileService, private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute, private messageService: MessageService,
    private toastrService: ToastrService, private _datePipe: DatePipe , private translate :TranslateService) { }

  ngOnInit() {

    $('.datetimepicker').bootstrapMaterialDatePicker({
      format: 'MM DD YYYY',
      time: false,
      clearButton: false,
      weekStart: 1
    });


    this._this = this;
    this._AuthService.getUserData(this.listOfWantedVariables).subscribe((user) => {
      this.activatedRoute.params.subscribe((params: Params) => { // getting the visited username
        this.vUsername = params.username;
      });

      // Fetching logged in user info
      this.avatar = user.data.avatar
      this.username = user.data.username;
      this.firstName = user.data.firstName;
      this.lastName = user.data.lastName;
      this.email = user.data.email;
      this.address = user.data.address;
      this.age = this.calculateAge(user.data.birthdate);
      this.phone = user.data.phone;
      this.schedule = user.data.schedule;
      this.studyPlans = user.data.studyPlans;
      this.listOfChildren = user.data.children;
      this.verified = user.data.verified;
      this.id = user.data._id;
      this.currIsChild = user.data.isChild;
      this.currIsParent = user.data.isParent;
      this.birthday = user.data.birthdate;
      this.birthdayView = this._datePipe.transform(user.data.birthdate, 'MM/dd/yyyy');
      this.dFirstName = this.firstName;
      this.dLastName = this.lastName;
      this.dAddress = this.address;
      this.dPhone = this.phone[0];
      this.dEmail = this.email;
      this.dBirthday = this.birthday;
      this.dUsername = this.username;
      this.blocklist = user.data.blocked;
      this.currIsAdmin = user.data.isAdmin;
      if (this.age > 13) {
        this.currIsOfAge = true;
      }
      if (this.age >= 18) {
        this.currCanBeParent = true;
      }



      if (!this.vUsername || this.vUsername === this.username) {
        this.currIsOwner = true;
        this.vUsername = this.username;
      }

      if (this.avatar != '') {
        this.currHasPP = true;
      }


      if (!this.currIsOwner) { // Fetching other user's info, if the logged in user is not the owner of the profile
        this._AuthService.getAnotherUserData(this.vListOfWantedVariables, this.vUsername).subscribe(((info) => {
          this.vAvatar = info.data.avatar;
          this.vFirstName = info.data.firstName;
          this.vLastName = info.data.lastName;
          this.vEmail = info.data.email;
          this.vAddress = info.data.address;
          this.vPhone = info.data.phone;
          this.vBirthday = info.data.birthdate;
          this.vBirthdayView = this._datePipe.transform(info.data.birthdate, 'MM/dd/yyyy');
          this.vListOfChildren = info.data.children;
          this.vAge = this.calculateAge(this.vBirthday);
          this.vVerified = info.data.verified;
          this.vId = info.data._id;
          this.visitedIsParent = info.data.isParent;
          this.visitedIsChild = info.data.isChild;
          this.visitedIsAdmin = info.data.isAdmin;
          if (!(this.listOfChildren.indexOf(this.vUsername.toLowerCase()) < 0)) {
            this.visitedIsMyChild = true;
          }
          console.log(this.listOfChildren);
          if (!(this.vListOfChildren.indexOf(this.username.toLowerCase()) < 0)) {
            this.visitedIsMyParent = true;
          }
          if (this.vAge > 13) {
            this.visitedIsOfAge = true;
          }
          if (this.vAge >= 18) {
            this.visitedCanBeParent = true;
          }
          if (this.vAvatar != '') {
            this.visitedHasPP = true;
          }

          this.dFirstName = info.data.firstName;
          this.dLastName = info.data.lastName;
          this.dAddress = info.data.address;
          this.dPhone = info.data.phone[0];
          this.dEmail = info.data.email;
          this.dBirthday = info.data.birthdate;
          this.dUsername = info.data.username;
          // Getting the list of uncommon children
          this.listOfUncommonChildren = this.listOfChildren.filter(item => this.vListOfChildren.indexOf(item) < 0);

        }));
      }
    });

  }

  requestContributerValidation() {
    // let obj = {
    //   status: 'pending',
    //     bio: 'machine learning, AI, Art, Music, Philosophy',
    //     name: 'Ahmed Khaled',
    //     AvatarLink: '../../../assets/images/profile-view/defaultPP.png',
    //     ProfileLink: 'profilemaher.com',
    //     image: 'imageMaher.com',
    //     creator: '5ac12591a813a63e419ebce5'
    // }
    this._ProfileService.makeContributerValidationRequest({}).subscribe(function (res) {
      // console.log(res);
    });
  }

  addChild(child): void { // adds a the selected child to the visited user list of children
    let object = {
      child: child
    };
    let self = this;
    this._ProfileService.linkAnotherParent(object, this.vId).subscribe(function (res) {
      self.toastrService.success(res.msg);
      // alert(res.msg);
    });

  }


  removeChild(child): void { // removes the child from the list of children of the currently logged in user
    let object = {
      child: child
    };
    let self = this;
    this._ProfileService.Unlink(object, this.id).subscribe(function (res) {
      self.toastrService.success(res.msg);
      // alert(res.msg);
    });
  }

  linkToParent(): void { // adds the currently logged in child to the list of children of the selected user
    let object = {
      child: this.username
    };
    let self = this;
    this._ProfileService.linkAsParent(object, this.vId).subscribe(function (res) {
      self.toastrService.success(res.msg);
      // alert(res.msg);
    });
  }


  ChangePassword(pws: any): void {
    const self = this;
    if (!(pws.newpw === pws.confirmpw)) {
      self.toastrService.warning('New and confirmed passwords do not match!');


    } else if ((pws.newpw.length < 8)) {
      self.toastrService.warning('Password should be at least 8 characters.');
    } else {
      this._ProfileService.changePassword(this.id, pws).subscribe(function (res) {
        self.toastrService.success(res.msg);
      });

    }
  } // Author: Heidi
  EditChildIndependence() {
let self =this;
// getting the visited profile username and passing it to service
// method to add it to the patch request
    this._ProfileService.EditChildIndependence(this.vUsername).subscribe((function (res) {
      if( res.msg.indexOf('13') < 0){ self.visitedIsChild=false;     self.translate.get('PROFILE.TOASTER.MAKE_INDEPENDENT_SUCCESS').subscribe(
        function(translation) {
          self.toastrService.success(translation);
        });  }
       else{    self.translate.get('PROFILE.TOASTER.MAKE_INDEPENDENT_FAIL').subscribe(
        function(translation) {
          self.toastrService.error(translation);
        }); }
    }));// if res.msg contains 13 then the child is under age and action is not allowed
    
  }  // Author :Heidi
  UnlinkMyself() {
// getting the visited profile username and passing it to service method to add it to the patch request
let self =this;
    this._ProfileService.UnlinkMyself(this.vUsername).subscribe((function (res) {
  if (res.msg.indexOf('Successefully')>-1) 
  { self.visitedIsMyParent = false;     
     self.translate.get('PROFILE.TOASTER.UNLINK_INDEPENDENT_FAIL').subscribe(
    function(translation) {
      self.toastrService.error(translation);
    }); ;}
    }));
  }



  changeChildInfo() {
    const info = {
      id: this.vId,
      username: (<HTMLInputElement>document.getElementById('dUsername')).value,
      firstName: (<HTMLInputElement>document.getElementById('dFirstName')).value,
      lastName: (<HTMLInputElement>document.getElementById('dLastName')).value,
      address: (<HTMLInputElement>document.getElementById('dAddress')).value,
      phone: (<HTMLInputElement>document.getElementById('dPhone')).value,
      birthdate: (<HTMLInputElement>document.getElementById('dBirthday')).value,
      email: (<HTMLInputElement>document.getElementById('dEmail')).value
    };
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const self = this;
    if (re.test(info.email)) {
      this._ProfileService.changeChildinfo(info).subscribe(function (res) {
        self.toastrService.success(res.msg);
        // alert(res.msg);
      });

    } else {
      self.toastrService.error('Please enter a valid email address');
//      alert('Please enter a valid email address');
    }
  }

  // Edit My Personal Info
  ChangeInfo(): void {
    const info = {
      username: (<HTMLInputElement>document.getElementById('qUsername')).value,
      firstName: (<HTMLInputElement>document.getElementById('qFirstName')).value,
      lastName: (<HTMLInputElement>document.getElementById('qLastName')).value,
      address: (<HTMLInputElement>document.getElementById('qAddress')).value,
      phone: (<HTMLInputElement>document.getElementById('qPhone')).value,
      birthdate: (<HTMLInputElement>document.getElementById('qBirthday')).value,
      email: (<HTMLInputElement>document.getElementById('qEmail')).value
    };
    console.log(info);
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const self = this;
    if (re.test(info.email)) {
      this._ProfileService.ChangeInfo(this.id, info).subscribe(function (res) {
        self.toastrService.success(res.msg);
        // alert(res.msg);
      });

    } else {
      self.toastrService.error('Please enter a valid email address');
//      alert('Please enter a valid email address');
    }
  }

  calculateAge(birthdate: Date): Number {
    const birthday = new Date(birthdate);
    const today = new Date();
    const age = ((today.getTime() - birthday.getTime()) / (31557600000));
    const result = Math.floor(age);
    return result;
  }

  reportPopUp() {
    swal({
      title: 'Report',
      text: 'Write a reason for your report:',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'Please provide a reason'
    }, (inputValue) => {
      if (inputValue === false) { return false; }
      if (inputValue === '') {
        swal.showInputError('Sorry, you must enter a reason'); return false;
      }
      this.reportReason = inputValue;
      const report = {
        reportedPerson: this.vUsername,
        reporter: this.username,
        reason: inputValue
      };
      // console.log(report.reporter + ' ' + report.reason + ' ' + report.reportedPerson);
      this.sendReport(report);
      swal('Report sent!', 'reason: ' + inputValue, 'success');
    });

  }
  sendReport(report) {
    // console.log('wasalt el sendReport');
    this._ProfileService.reportUser(report, this.vId).subscribe();
  }


  unblockUser(blocked) {
    //calling the unblocking method in the service

    const self = this;
    for (let i = 0; i < this.blocklist.length; i++) {
      if (this.blocklist[i] === blocked) {

        this.blocklist.splice(i, 1);
        //   console.log('this user is no longer blocked', blocked);
        //  console.log('updated list is', this.blocklist);
      }  //end if
    }//end for

    this.messageService.unBLock(this.id, this.blocklist).subscribe(function (res) {
      if (res.msg) {
        self.toastrService.success(res.msg);
      }//end if
    });
  }

  uploaded(url: string) {
    if (url === 'imageFailedToUpload') {
      // console.log('image upload failed');
      this.toastrService.error('Image upload failed');
    } else if (url === 'noFileToUpload') {
      this.toastrService.error('Please select a photo');
    } else {
      var upload = {
        id: this.id,
        url: url
      };
      // console.log('in vcC and its uploaded with url = '+ url);
      this._ProfileService.changeProfilePic(upload).subscribe((res) => {
        if (res.data) {
          this.toastrService.success('Profile picture changed successfully');
        } else {
          this.toastrService.error('Image upload failed')
        }
      });
      // TODO: handle image uploading success and use the url to retrieve the image later
    }
    document.getElementById('closeModal').click();
    document.focus;

  }

  deleteStudyPlan(index): void {
    let plan = this.currIsOwner ? this.studyPlans[index] : this.vStudyPlans[index];
    this._ProfileService
      .deleteStudyPlan(plan._id)
      .subscribe(res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else if (res.msg) {
          this.studyPlans.splice(index, 1);
          this.toastrService.success(res.msg);
        }
      });
  }

}
