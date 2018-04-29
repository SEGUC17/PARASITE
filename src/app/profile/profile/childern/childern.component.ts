import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService } from './../../../auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-childern',
  templateUrl: './childern.component.html',
  styleUrls: ['./childern.component.scss']
})
export class ChildernComponent implements OnInit {

  // public one: Child = {

//  }


  childrenList: string[];
  avatars: string[];
  username: string;
  // ---------------------variables $ flag for Unlink my child ----------------
  id: any;
  vUsername: string;
  isParent: boolean;
  currIsOwner = false;
  birthdate: Date;
// -----------------------------------------------------------
  singleArray: [{avatar: string, firstName: string, lastName: string, birthdate: Number , username: string }];
  constructor (private profileService: ProfileService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private toaster: ToastrService) { }

  ngOnInit() {

    this.avatars = [''];
    this.singleArray = [{avatar: '', firstName: '', lastName: '', birthdate: 0 , username: '' }];

    this.getChildern();

    this.authService.getUserData(['username', '_id', 'isParent']).subscribe((user) => {
      this.activatedRoute.params.subscribe((params: Params) => {
        // getting the visited username
        this.vUsername = params.username;
      });
  this.id = user.data._id;
  this.isParent = user.data.isParent;

  if (!this.vUsername || this.vUsername === this.username) {
    this.currIsOwner = true;
    this.vUsername = this.username;
  }
    });

 } // Heidi

 calculateAge(birthdate: Date): Number {
  const birthday = new Date(birthdate);
  const today = new Date();
  const age = ((today.getTime() - birthday.getTime()) / (31557600000));
  const result = Math.floor(age);
  return result;
}
  getChildern() {
    let username;
    let id;
let counter = 0;

    let self = this;
    // getting username of the authenticated user and adding it to the get request
    this.authService.getUserData(['username']).subscribe(function (res) {
      self.username = res.data.username;
      console.log('Here ' + self.username);
      // calling service method that sends get request and subscribing to the data from the response
      self.profileService.getChildren(self.username).subscribe(function(response) { self.childrenList = response.data;

console.log(self.childrenList);

// getting username , avatar , first name , lastname , birthdate of
// each child in children list and adding them to a single array
self.singleArray.pop();
for (let x of self.childrenList) {
self.authService.getAnotherUserData(['firstName', 'avatar',
 'lastName', 'birthdate' , 'username'], x ).subscribe(function (result) {

  if (!result.data.avatar) {
    result.data.avatar = 'assets/images/xs/avatar3.jpg';
   }
        self.singleArray.push({
                             avatar: result.data.avatar,
                             firstName: result.data.firstName,
                             lastName: result.data.lastName,
                             birthdate   : self.calculateAge(result.data.birthdate),
                            username: result.data.username
               });
                         counter++;
                        });
                        }

    });
  });
}
removeChild(child): void { // removes the child from the list of children of the currently logged in user
  let ChildBirthdate: Date;
  let age;
  let object = {
    child: child
  };
  const self = this;
  // getting the birthdate of the child to get his/her age;
    this.authService.getAnotherUserData(['_id', 'birthdate'], child).subscribe(((user) => {
     age = this.calculateAge(user.data.birthdate);

if ( age < 13) {
  self.toaster.error('You can only unlink children 13 or above');
}
if ( age >= 13) {
this.profileService.Unlink(object, this.id).subscribe(function (res) {
    self.toaster.success(res.msg);
});
}
}));
}
}
