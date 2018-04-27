import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { ContentViewComponent } from './content-view/content-view.component';
const routes = [
  {
    path: 'view',
    component: ContentListViewComponent,
    children: [
      {
        path: ':tag',
        component: ContentListViewComponent
      },
      {
        path: ':id',
        component: ContentViewComponent
      }
    ]
  },
  {
    path: 'edit',
    component: ContentEditComponent,
    children: [
      {
        path: ':id',
        component: ContentEditComponent,
      }

    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContentRoutingModule { }
