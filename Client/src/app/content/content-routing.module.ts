import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
const routes = [
  { path: 'content-edit', component: ContentEditComponent },
  { path: 'contnet-list-view', component: ContentListViewComponent}
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
