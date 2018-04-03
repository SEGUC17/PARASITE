import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService} from '../../auth/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {


// ---------- FLAGS --------------------
// User Flags
currIsOwner = false;
currIsParent = false;
currIsChild = false;

visitedIsParent = false;
visitedIsChild = false;
visitedIsMyChild = false;
// ------------------------------------


// ---------- Current User Info ---------------
user: any;
firstName: String = 'Fulan';
lastName: String = 'El Fulany';
username: String;
age: Number;
email: String;
address: String;
phone: [String];
schedule: any;
studyPlans: any;
birthday: Date;
listOfChildren: any[] = [];
verified: Boolean = false;
id: any;
// -------------------------------------

// ---------Visited User Info-----------
vUser: any;
vFirstName: String = 'Fulan';
vLastName: String = 'El Fulany';
vUsername: String;
vAge: Number;
vEmail: String;
vAddress: String;
vPhone: [String];
vSchedule: any;
vStudyPlans: any;
vBirthday: Date;
vListOfChildren: any[] = [];
vVerified: Boolean = false;
vId: any;
// ------------------------------------



// ------------------------------------
listOfAllChildren: any[];
listOfUncommonChildren: any[];



  constructor(private _ProfileService: ProfileService, private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.vUsername = params.username;
    });
    if (this.vUsername) {
    this.user = this._AuthService.getUser();
    if (this.user.username === this.vUsername) {
      this.currIsOwner = true;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.age = this.user.birthday;
      this.email = this.user.email;
      this.address = this.user.address;
      this.phone = this.user.phone;
      this.schedule = this.user.schedule;
      this.studyPlans = this.user.studyPlans;
      this.birthday = this.user.birthday;
      this.listOfChildren = this.user.children;
      this.verified = this.user.verified;
      this.id = this.user._id;
      this.currIsChild = this.user.isChild;
      this.currIsParent = this.user.isParent;
    } else {
      this._ProfileService.getUserInfo(this.vUsername).subscribe(((info) => {
        this.vFirstName = info.firstName;
        this.vLastName = info.lastName;
        this.vAge = info.birthday;
        this.vEmail = info.email;
        this.vAddress = info.address;
        this.vPhone = info.phone;
        this.vSchedule = info.schedule;
        this.vStudyPlans = info.studyPlans;
        this.vBirthday = info.birthday;
        this.vListOfChildren = info.children;
        this.vVerified = info.verified;
        this.vId = info._id;
        this.visitedIsParent = info.isParent;
        this.visitedIsChild = info.isChild;
        if (!(this.listOfChildren.indexOf(this.vUsername) < 0)) {
          this.visitedIsMyChild = true;
        }
    }));
    this.listOfUncommonChildren = this.listOfChildren.filter(item => this.vListOfChildren.indexOf(item) < 0);
    }
  }
  }

  ngOnInit() {

  }

  requestContributerValidation() {
    console.log(this._ProfileService.makeContributerValidationRequest().subscribe());
  }

  addChild(child): void {

    this.vListOfChildren.push(child);
    this._ProfileService.linkAnotherParent(this.vListOfChildren, this.vId).subscribe();

  }


  viewChildren(): void {
    document.getElementById('UnlinkChildren').classList.toggle('show');
  }

  removeChild(child): void {
    this.listOfChildren.splice(this.listOfChildren.indexOf(child) , 1);
    this._ProfileService.Unlink(this.listOfChildren, this.id ).subscribe();
  }

  linkToParent(child): void {
    // this.vlistOfChildren.push(child);
    this._ProfileService.linkAsParent(child, this.vId).subscribe();


     this._ProfileService.linkAsParent(child, this.vId).subscribe();
  }

  changePassword(oldpw, newpw: any): void {
    this._ProfileService.changePassword(oldpw, newpw).subscribe();
  }

}
