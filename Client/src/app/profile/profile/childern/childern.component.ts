import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService} from './../../../auth/auth.service';

@Component({
  selector: 'app-childern',
  templateUrl: './childern.component.html',
  styleUrls: ['./childern.component.css']
})
export class ChildernComponent implements OnInit {




  child: String[];
  constructor(private profileService: ProfileService, private authService: AuthService) {  this.getChildern();}

  ngOnInit() {

  }
  getChildern() {

  this.profileService.getChildren().subscribe(res => this.child = res.data);

  console.log(this.child);
  }
}


