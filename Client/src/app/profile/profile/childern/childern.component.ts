import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService} from './../../../auth/auth.service';

@Component({
  selector: 'app-childern',
  templateUrl: './childern.component.html',
  styleUrls: ['./childern.component.css']
})
export class ChildernComponent implements OnInit {




  child: string[];
  username: string;
  constructor(private profileService: ProfileService, private authService: AuthService) {  this.getChildern(); }

  ngOnInit() {

  }
  getChildern() {
    this.authService.getUserData(['username']).subscribe((user) => this.username = user.username);
    this.profileService.getChildren(this.username).subscribe(res => this.child = res.data);
  }
}


