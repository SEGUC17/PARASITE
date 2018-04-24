/* tslint:disable-next-line:max-line-length */
/* tslint:disable */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare const swal: any;
declare const $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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

  visitedIsParent = false;
  visitedIsChild = false;
  visitedIsMyChild = false;
  visitedIsMyParent = false;
  visitedIsOfAge = false;
  visitedCanBeParent = false;
  visitedOld = true;
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

  // ------------------------------------
  changePass: Boolean;
  childInfo: Boolean;
  personalInfo: Boolean;
  // ----------- Other Lists ------------
  listOfUncommonChildren: any[];
  listOfWantedVariables: string[] = ['_id', 'avatar', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
    'email', 'address', 'phone', 'birthdate', 'children', 'verified', 'isChild', 'isParent'];
  vListOfWantedVariables: string[] = ['_id', 'avatar', 'firstName', 'lastName', 'email',
    'address', 'phone', 'birthdate', 'children', 'verified', 'isChild', 'isParent', 'username'];
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
  constructor(private _ProfileService: ProfileService, private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._this = this;
    this._AuthService.getUserData(this.listOfWantedVariables).subscribe((user) => {
      this.activatedRoute.params.subscribe((params: Params) => { // getting the visited username
        this.vUsername = params.username;
      });

      // Fetching logged in user info
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
      this.dFirstName = this.firstName;
      this.dLastName = this.lastName;
      this.dAddress = this.address;
      this.dPhone = this.phone[0];
      this.dEmail = this.email;
      this.dBirthday = this.birthday;
      this.dUsername = this.username;
      if (this.age > 13) {
        this.currIsOfAge = true;
      }




      if (!this.vUsername || this.vUsername === this.username) {
        this.currIsOwner = true;
        this.vUsername = this.username;
      }


      if (!this.currIsOwner) { // Fetching other user's info, if the logged in user is not the owner of the profile
        this._AuthService.getAnotherUserData(this.vListOfWantedVariables, this.vUsername).subscribe(((info) => {
          this.vFirstName = info.data.firstName;
          this.vLastName = info.data.lastName;
          this.vEmail = info.data.email;
          this.vAddress = info.data.address;
          this.vPhone = info.data.phone;
          this.vBirthday = info.data.birthdate;
          this.vListOfChildren = info.data.children;
          this.vAge = this.calculateAge(this.vBirthday);
          this.vVerified = info.data.verified;
          this.vId = info.data._id;
          this.visitedIsParent = info.data.isParent;
          this.visitedIsChild = info.data.isChild;
          if (!(this.listOfChildren.indexOf(this.vUsername.toLowerCase()) < 0)) {
            this.visitedIsMyChild = true;
          }
          if (!(this.vListOfChildren.indexOf(this.username.toLowerCase()) < 0)) {
            this.visitedIsMyParent = true;
          }
          if (this.vAge > 13) {
            this.visitedIsOfAge = true;
          }
          if (this.vAge >= 18) {
            this.visitedCanBeParent = true;
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
      console.log(res);
    });
  }

  addChild(child): void { // adds a the selected child to the visited user list of children
    let object = {
      child: child
    };
    this._ProfileService.linkAnotherParent(object, this.vId).subscribe(function (res) {
      alert(res.msg);
    });

  }


  removeChild(child): void { // removes the child from the list of children of the currently logged in user
    let object = {
      child: child
    };
    this._ProfileService.Unlink(object, this.id).subscribe(function (res) {
      alert(res.msg);
    });
  }

  linkToParent(): void { // adds the currently logged in child to the list of children of the selected user
    let object = {
      child: this.username
    };
    this._ProfileService.linkAsParent(object, this.vId).subscribe(function (res) {
      alert(res.msg);
    });
  }


  ChangePassword(pws: any): void {
    if (!(pws.newpw === pws.confirmpw)) {
      console.log('passwords dont match');
      this.message = 'New and confirmed passwords do not match!';


    } else if ((pws.newpw.length < 8)) {
      console.log('pw too short');
      this.message = 'Password should be more than 8 characters';
    } else {
      console.log(pws.oldpw);
      this._ProfileService.changePassword(this.id, pws).subscribe(function (res) {
        console.log(res.msg);
        alert(res.msg);
      });

    }
  } // Author: Heidi
  EditChildIndependence() {

    this._ProfileService.EditChildIndependence(this.vUsername).subscribe((function (res) {

      alert(res.msg);

    }));
    // getting the visited profile username and passing it to service method to add it to the patch request

  }  // Author :Heidi
  UnlinkMyself() {
// getting the visited profile username and passing it to service method to add it to the patch request
    this._ProfileService.UnlinkMyself(this.vUsername).subscribe((function (res) {
      console.log(res.msg);
      alert(res.msg);

  if (res.msg === 'Successefully removed child from parent\'s list of children') { this.visitedIsMyParent = false; }
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
    if (re.test(info.email)) {
      this._ProfileService.changeChildinfo(info).subscribe(function (res) {
        alert(res.msg);
      });

    } else {
      alert('Please enter a valid email address');
    }
  }

  // Edit My Personal Info
  ChangeInfo(): void {
    const info = {
      username: (<HTMLInputElement>document.getElementById('dUsername')).value,
      firstName: (<HTMLInputElement>document.getElementById('dFirstName')).value,
      lastName: (<HTMLInputElement>document.getElementById('dLastName')).value,
      address: (<HTMLInputElement>document.getElementById('dAddress')).value,
      phone: (<HTMLInputElement>document.getElementById('dPhone')).value,
      birthdate: (<HTMLInputElement>document.getElementById('dBirthday')).value,
      email: (<HTMLInputElement>document.getElementById('dEmail')).value
    };
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(info.email)) {
      this._ProfileService.ChangeInfo(this.id, info).subscribe(function (res) {
        alert(res.msg);
      });

    } else {
      alert('Please enter a valid email address');
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
        console.log(report.reporter + ' ' + report.reason + ' ' + report.reportedPerson);
        this.sendReport(report);
        swal('Report sent!', 'reason: ' + inputValue, 'success');
    });

}
  sendReport(report) {
    console.log('wasalt el sendReport');
    this._ProfileService.reportUser(report, this.vId).subscribe();
  }

}
