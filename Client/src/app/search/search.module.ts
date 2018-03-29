import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchControlComponent } from './search-control/search-control.component';
import { SearchRoutingModule } from './search-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule
  ],
  declarations: [SearchControlComponent]
})
export class SearchModule { }
