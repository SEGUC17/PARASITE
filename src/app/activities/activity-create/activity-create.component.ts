import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploaderComponent } from '../../image-uploader/image-uploader.component';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../activity.service';
import { ActivityCreate } from '../activity';
import { ActivityComponent } from '../activity/activity.component';

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
    private imageUploader: ImageUploaderComponent,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
  }

  createActivity(check: Boolean) {
    /*
      Creating a new activity after converting the dates to
      unix timestamp

      @author: Wessam
    */
   if (!check) {
    this.toaster.error('Please fill in the form correctly');
   } else if (this.activity.toDateN <= this.activity.fromDateN) {
    this.toaster.error('End date cannot be before or equal to the start date');
   } else {
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
  }

  close(): void {
    /* close dialog */
    this.activityComponent.closeModal();
  }

  uploaded(url: string) {
    if (url === 'imageFailedToUpload') {
      this.translate.get('ACTIVITIES.CREATE.FAILED_TO_UPLOADs').subscribe(
        res => this.toaster.error(res)
      );
    } else {
      this.activity.image = url;
    }
    console.log(this.activity);
  }

}
