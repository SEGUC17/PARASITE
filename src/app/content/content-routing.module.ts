import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { ContentRedirectorComponent } from './content-redirector/content-redirector.component';
const routes = [
  {
    path: 'list',
    children: [
      {
        path: '',
        component: ContentListViewComponent
      },
      {
        path: ':tag',
        component: ContentListViewComponent
      }
    ]
  },
  {
    path: 'view/:id',
    component: ContentViewComponent
  },
  {
    path: 'edit',
    children: [
      {
        path: '',
        component: ContentEditComponent
      },
      {
        path: ':id',
        component: ContentEditComponent,
      }
    ]
  },
  {
    path: 'redirect/:id',
    component: ContentRedirectorComponent
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
