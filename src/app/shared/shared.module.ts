import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { StarRatingModule } from 'angular-star-rating';
import { FileSelectDirective } from 'ng2-file-upload';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    StarRatingModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      maxOpened: 3
    })
  ],
  declarations: [RatingComponent, ImageUploaderComponent, FileSelectDirective],
  exports: [RatingComponent, StarRatingModule, ImageUploaderComponent]
})
export class SharedModule { }