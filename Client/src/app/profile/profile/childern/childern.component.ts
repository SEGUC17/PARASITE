import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService } from './../../../auth/auth.service';
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

  singleArray: [{username: string, educationLevel: string, educationSystem: string, avatar: string}];
  constructor (private profileService: ProfileService, private authService: AuthService) { }

  ngOnInit() {
    this.avatars = [''];
    this.singleArray = [{username: '', educationLevel: '' , educationSystem: '' , avatar: ''}];

    this.getChildern();


 } // Heidi
  getChildern() {
    let username;
let counter = 0;
    let self = this;
    // getting username of the authenticated user and adding it to the get request
    this.authService.getUserData(['username']).subscribe(function (res) {
      self.username = res.data.username;
      console.log('Here ' + self.username);
      // calling service method that sends get request and subscribing to the data from the response
      self.profileService.getChildren(self.username).subscribe(function(response) { self.childrenList = response.data;

console.log(self.childrenList);

self.singleArray.pop();
for (let x of self.childrenList) {
self.authService.getAnotherUserData(['username', 'avatar',
 'educationLevel', 'educationSystem'], x ).subscribe(function (result) {



        self.singleArray.push({
                             username: self.childrenList[counter],
                             educationLevel: result.data.educationLevel,
                             educationSystem: result.data.educationSystem,
                             avatar: result.data.avatar
               });
                         counter++;
                        });
                        }

    });
  });
}}
