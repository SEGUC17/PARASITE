import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchControlComponent } from './search-control/search-control.component';
import {MatChipsModule} from '@angular/material/chips';
const routes = [
  { path: 'search', component: SearchControlComponent }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SearchRoutingModule { }
