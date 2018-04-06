import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChildsignupComponent } from './childsignup.component';
const routes = [
  { path: 'childsignup', component: ChildsignupComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class ChildsignupRoutingModule { }
