import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ChildernComponent } from './profile/childern/childern.component';

@NgModule({
  imports: [
    ProfileRoutingModule
  ],
  declarations: [ProfileComponent, ChildernComponent]
})
export class ProfileModule { }
