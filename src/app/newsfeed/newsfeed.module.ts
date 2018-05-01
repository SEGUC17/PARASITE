import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { NewsfeedRoutingModule } from './newsfeed-routing.module';
import { NewsfeedService } from './newsfeed.service';
@NgModule({
  imports: [
    CommonModule,
    NewsfeedRoutingModule
  ],
  providers: [NewsfeedService],
  declarations: [NewsfeedComponent]
})
export class NewsfeedModule { }
