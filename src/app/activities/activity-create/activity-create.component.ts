import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../activity.service';
import { ActivityCreate } from '../activity';
import { ActivityComponent } from '../activity/activity.component';
import { ImageUploaderComponent } from '../../shared/image-uploader/image-uploader.component';

declare const $: any;

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {
  /*
    author: Wessam
  */

  public activity: ActivityCreate = {
    name: '',
    description: '',
    price: null,
    fromDateN: null,
    toDateN: null,
    fromDateTime: null,
    toDateTime: null,
    image: null,
    discussion: []
  };

  constructor(
    private router: Router,
    private activityService: ActivityService,
    private activityComponent: ActivityComponent,
    private translate: TranslateService,
    private imageUploader: ImageUploaderComponent
  ) { }

  ngOnInit() {
  }

  createActivity() {
    /*
      Creating a new activity after converting the dates to
      unix timestamp

      @author: Wessam
    */
    this.activity.fromDateTime = new Date(this.activity.fromDateN).getTime();
    this.activity.toDateTime = new Date(this.activity.toDateN).getTime();
    this.activityService.postActivities(this.activity).subscribe(
      res => {
        console.log(res);
        this.close();
        this.router.navigate([`activities/${res.data._id}`]);
      }
    );
  }

  close(): void {
    /* close dialog */
    this.activityComponent.closeModal();
  }

  uploaded(url: string) {
    if (url === 'imageFailedToUpload') {
      console.log('image upload failed');
      // TODO: handle image uploading failure
    } else {
      console.log('in vcC and its uploaded with url = ' + url);
      // TODO: handle image uploading success and use the url to retrieve the image later
    }
  }

}
