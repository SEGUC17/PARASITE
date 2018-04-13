import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'app-childern',
  templateUrl: './childern.component.html',
  styleUrls: ['./childern.component.scss']
})
export class ChildernComponent implements OnInit {




  child: string[];
  username: string;
  constructor(private profileService: ProfileService, private authService: AuthService) { this.getChildern(); }

  ngOnInit() {

  } // Heidi
  getChildern() {
    let username;

    let self = this;
    // getting username of the authenticated user and adding it to the get request
    this.authService.getUserData(['username']).subscribe(function (res) {
      self.username = res.data.username;
      console.log('Here ' + self.username);
      // calling service method that sends get request and subscribing to the data from the response
      self.profileService.getChildren(self.username).subscribe(response => self.child = response.data);
    });
  }
}


