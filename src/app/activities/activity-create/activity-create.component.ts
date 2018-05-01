import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploaderComponent } from '../../image-uploader/image-uploader.component';
import { ToastrService } from 'ngx-toastr';
import { ENTER, COMMA, SPACE, BACKSPACE } from '@angular/cdk/keycodes';
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

  brInput: Boolean = false;
  chipInput = '';
  public activity: ActivityCreate = {
    name: '',
    description: '',
    price: null,
    fromDateN: null,
    toDateN: null,
    fromDateTime: null,
    toDateTime: null,
    image: null,
    tags: [],
    discussion: []
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE, BACKSPACE];

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
     this.translate.get('ACTIVITIES.CREATE. ').subscribe(
       res => this.toaster.error(res)
     );
   } else if (this.activity.toDateN <= this.activity.fromDateN) {
     this.translate.get('ACTIVITIES.CREATE.DATE_ERROR').subscribe(
       res => this.toaster.error(res)
     );
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

  // Handle tag input on content edit
  onTagInput(event: KeyboardEvent): void {
    // IF the recorded key event is not a target one, ignore the event
    if (!this.separatorKeysCodes.includes(event.keyCode)) {
      return;
    }

    // Remove a tag on backspace
    if (event.keyCode === BACKSPACE) {
      if (this.chipInput) {
        return;
      }
      this.activity.tags.splice(-1, 1);
      return;
    }

    // Add tag
    if ((this.chipInput || '').trim()) {
      this.activity.tags.push(this.chipInput.trim());
    }

    // Reset the input value
    if (this.chipInput) {
      this.chipInput = '';
    }
  }

}
