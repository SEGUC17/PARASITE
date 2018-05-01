import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { StarRatingModule } from 'angular-star-rating';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    StarRatingModule.forRoot()
  ],
  declarations: [RatingComponent, ImageUploaderComponent, FileSelectDirective],
  exports: [RatingComponent, StarRatingModule, ImageUploaderComponent, FileSelectDirective]
})
export class SharedModule { }
