import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { CloudinaryCredentials } from '../variables';




@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {


  //
  // # Getting Started;
  //
  // first module:
  //  import { SharedModule } from '../shared/shared.module'; in your module
  //  and add it to the imports field
  //
  // Second in HTML:
  //  <app-image-uploader (ImageUploaded) = "uploaded($event)"></app-image-uploader>
  //
  //
  // Third in Component:
  //     uploaded(url: string) {
  //       if(url === 'imageFailedToUpload') {
  //       } else {
  //       }
  //     }
  //

  @Output() ImageUploaded = new EventEmitter<string>();
  @Input() brWanted: Boolean = true;

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({ cloudName: CloudinaryCredentials.cloudName, uploadPreset: CloudinaryCredentials.uploadPreset })
  );

  loading: any;
  filePath = '';

  constructor() { }

  ngOnInit() {
  }


  upload() {
    let self = this;
    if (this.uploader.queue.length > 0) {
      this.loading = true;
      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (
        item: any,
        response: string,
        status: number,
        headers: any): any => {
        let res: any = JSON.parse(response);
        this.loading = false;
        self.ImageUploaded.emit(res.url);
      };
      this.uploader.onErrorItem =
        function (fileItem, response, status, headers) {
          // console.info('onErrorItem', fileItem, response, status, headers);
          self.ImageUploaded.emit('imageFailedToUpload');
        };
    } else {
      self.ImageUploaded.emit('noFileToUpload');
    }
  }

}
