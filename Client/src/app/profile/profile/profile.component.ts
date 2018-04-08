import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
pws: {oldpw: '', newpw: '', confirmpw: ''};

// -------------------------------------

// ---------Visited User Info-----------
vUser: any;
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
message:string;
// ------------------------------------

// ----------- Other Lists ------------
listOfUncommonChildren: any[];
listOfWantedVariables: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent'];
vListOfWantedVariables: string[] = ['_id', 'firstName', 'lastName', 'email',
'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent'];
// ------------------------------------

  constructor(private _ProfileService: ProfileService,
    private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this._AuthService.getUserData(['username']).subscribe((user) => {
      this.username = user.data.username;
    this.activatedRoute.params.subscribe((params: Params) => { // getting the visited username
      this.vUsername = params.username;
      if (!this.vUsername) {
        // this.router.navigateByUrl('/profile/' + this.username );
        this.vUsername = this.username;
      }


    if (this.vUsername === this.username) {
      this.currIsOwner = true;
    }
    // Fetching logged in user info
    this.user = this._AuthService.getUserData(this.listOfWantedVariables).subscribe(((owner) => {
      this.username = owner.data.username;
      this.firstName = owner.data.firstName;
      this.lastName = owner.data.lastName;
      this.email = owner.data.email;
      this.address = owner.data.address;
      this.phone = owner.data.phone;
      this.schedule = owner.data.schedule;
      this.studyPlans = owner.data.studyPlans;
      this.listOfChildren = owner.data.children;
      this.verified = owner.data.verified;
      this.id = owner.data._id;
      this.currIsChild = owner.data.isChild;
      this.currIsParent = owner.data.isParent;

    if (!this.currIsOwner) { // Fetching other user's info, if the logged in user is not the owner of the profile
      this._AuthService.getAnotherUserData(this.vListOfWantedVariables, this.vUsername).subscribe(((info) => {
        this.vFirstName = info.data.firstName;
        this.vLastName = info.data.lastName;
        this.vAge = info.data.birthday;
        this.vEmail = info.data.email;
        this.vAddress = info.data.address;
        this.vPhone = info.data.phone;
        this.vBirthday = info.data.birthday;
        this.vListOfChildren = info.data.children;
        this.vVerified = info.data.verified;
        this.vId = info.data._id;
        this.visitedIsParent = info.data.isParent;
        this.visitedIsChild = info.data.isChild;
        if (this.visitedIsChild) {
          this.visitedIsMyChild = !(this.listOfChildren.indexOf(this.vUsername) < 0);
        }
    }));
    // Getting the list of uncommon children
    this.listOfUncommonChildren = this.listOfChildren.filter(item => this.vListOfChildren.indexOf(item) < 0);
    }
  }));
  });
  });
  }


  ngOnInit() {

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
    this._ProfileService.makeContributerValidationRequest({}
    ).subscribe(function (res) {
      console.log(res);
    });
  }

  addChild(child): void { // adds a the selected child to the visited user list of children

    this._ProfileService.linkAnotherParent(child, this.vId).subscribe();

  }


  removeChild(child): void { // removes the child from the list of children of the currently logged in user
    this._ProfileService.Unlink(child, this.id).subscribe();
  }

  linkToParent(child): void { // adds the currently logged in child to the list of children of the selected user
    this._ProfileService.linkAsParent(child, this.vId).subscribe();
  }


  ChangePassword(pws: any): void {
    if (!(pws.newpw === pws.confirmpw)) {
      console.log('passwords dont match');
      this.message = 'New and confirmed passwords do not match!';


    } else if (( pws.newpw.length < 8 )) {
        console.log('pw too short');
        this.message = 'Password should be more than 8 characters';
    } else {
    console.log(pws.oldpw);
        this._ProfileService.changePassword(this.id, pws).subscribe(function(res) {
          console.log(res.msg);
          alert(res.msg);
        });

    }
}

}
