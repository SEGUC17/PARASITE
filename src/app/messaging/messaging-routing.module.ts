import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { MessagingComponent } from './messaging/messaging.component';
import { SingleMailComponent } from './single-mail/single-mail.component';

const routes = [
  { path: '', component: MessagingComponent },
  {
    path: 'single-mail',
    component: SingleMailComponent
},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessagingRoutingModule { }
