import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { ActivityCreate } from '../activity';
import { ActivatedRoute } from '@angular/router';

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
    private activityService: ActivityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  createActivity(){
    this.activity.fromDateTime = new Date(this.activity.fromDateN).getTime();
    this.activity.toDateTime = new Date(this.activity.toDateN).getTime();
    console.log(this.activity.fromDateTime);
    this.activityService.postActivities(this.activity).subscribe(
      function(res){
        if(res.status == 201){
          console.log(this.route.url);
        }
      }
    )
  }

}
