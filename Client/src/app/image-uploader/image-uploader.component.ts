import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { CloudinaryCredentials } from '../variables';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() ImageUploaded = new EventEmitter<string>();

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({ cloudName: CloudinaryCredentials.cloudName, uploadPreset: CloudinaryCredentials.uploadPreset })
  );

  loading: any;



  upload(){
    this.loading = true;
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      console.log(res);

    }
    this.uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);

    };
  }

}
