import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: []
})
export class ChildsignupRoutingModule { }
