import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader.component';
import { FileSelectDirective } from 'ng2-file-upload';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ImageUploaderComponent,
    FileSelectDirective
  ],
  exports:[
    ImageUploaderComponent
  ]
})
export class ImageUploaderModule { }
