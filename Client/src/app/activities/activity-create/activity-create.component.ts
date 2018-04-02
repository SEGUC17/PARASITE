import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivityService } from '../activity.service';
import { ActivityCreate } from '../activity';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.css']
})
export class ActivityCreateComponent implements OnInit {

  public activity: ActivityCreate = {
    name: '',
    description: '',
    price: 0,
    fromDateN: null,
    toDateN: null,
    fromDateTime: null,
    toDateTime: null,
    image: null
  };

  constructor( 
    private router: Router,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
  }

  createActivity(){
    this.activity.fromDateTime = new Date(this.activity.fromDateN).getTime();
    this.activity.toDateTime = new Date(this.activity.toDateN).getTime();
    this.activityService.postActivities(this.activity).subscribe(
      res => {
          console.log(res);
          this.router.navigate([`activities/${res.data._id}`]);
      }
    )
  }

}
