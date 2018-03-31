import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
<<<<<<< HEAD
const routes = [
  { path: 'content-edit', component: ContentEditComponent },
  { path: 'content-list-view', component: ContentListViewComponent}
=======
import { ContentViewComponent } from './content-view/content-view.component';
const routes = [
  { path: 'content-edit', component: ContentEditComponent },
  { path: 'content-list-view', component: ContentListViewComponent},
  { path: 'content-view/:id', component: ContentViewComponent }
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
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
