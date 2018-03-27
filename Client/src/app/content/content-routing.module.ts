import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentEditComponent } from './content-edit/content-edit.component';
const routes = [
  { path: 'content-edit', component: ContentEditComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContentRoutingModule { }
