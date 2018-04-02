import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
const routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:username', component: ProfileComponent }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutingModule { }
