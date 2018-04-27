import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService } from './../../../auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-childern',
  templateUrl: './childern.component.html',
  styleUrls: ['./childern.component.scss']
})
export class ChildernComponent implements OnInit {


  childrenList: string[];
  avatars: string[];
  username: string;
  singleArray: [{avatar: string, firstName: string,
    lastName: string, birthdate: Number , username: string , learningScore: Number}];
  constructor (private profileService: ProfileService,
     private authService: AuthService , private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.avatars = [''];
    this.singleArray = [{avatar: '', firstName: '', lastName: '',
     birthdate: 0 , username: '' , learningScore: 0}];
    this.getChildern();


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
let counter = 0;

    let self = this;
    this.authService.getUserData(['username']).
    subscribe(function (res) {
      self.username = res.data.username;
      console.log('Here ' + self.username);

    // getting username of the authenticated user
    // and adding it to the get request

    self.activatedRoute.params.subscribe((params: Params) => { // getting the username of the visited profile
        if (params.username === undefined) {
          self.username = res.data.username;
   } else { self.username = params.username; }
      console.log(self.username);
      // calling service method that sends get request and subscribing to the data from the response
      self.profileService.getChildren(self.username).
      subscribe(function(response) { self.childrenList = response.data;

console.log(self.childrenList);

// getting username , avatar , first name , lastname , birthdate of
// each child in children list and adding them to a single array
         self.singleArray.pop();
    for (let x of self.childrenList) {
   self.authService.getAnotherUserData(['firstName', 'avatar',
   'lastName', 'birthdate' , 'username' , 'learningScore'], x ).
    subscribe(function (result) {

  if (!result.data.avatar) {
    result.data.avatar = 'assets/images/defaultProfilePic.png';
   }

        self.singleArray.push({
                             avatar: result.data.avatar,
                             firstName: result.data.firstName,
                             lastName: result.data.lastName,
                             birthdate   : self.calculateAge(result.data.birthdate),
                             username: result.data.username,
                             learningScore: result.data.learningScore
               });
                         counter++;
                        });
                        }

    });
  });
});
} }
