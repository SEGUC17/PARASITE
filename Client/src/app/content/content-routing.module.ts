import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { ContentViewComponent } from './content-view/content-view.component';
const routes = [
  { path: 'content-edit', component: ContentEditComponent },
  { path: 'content-edit/:id', component: ContentEditComponent },
  { path: 'content-list-view', component: ContentListViewComponent },
  { path: 'content-view/:id', component: ContentViewComponent }
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
