import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {
  /*
    @author: Wessam
  */
 
  activity: Activity;

  constructor( 
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    this.getActivity();
  }

  getActivity() {
    /*
      Getting the activities from the api

      @var event: An object that gets fired by mat-paginator

      @author: Wessam
    */
    let id = this.route.snapshot.paramMap.get('id');
    this.activityService.getActivity(id).subscribe(
      res => {
        this.activity = res.data;
        if (!this.activity.image) {
          this.activity.image = "assets/images/activity-view/default-activity-image.jpg";
        }
      }
    )
  }

}
