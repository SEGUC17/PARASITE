import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentRoutingModule } from './content-routing.module';
@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  declarations: [ContentEditComponent]
})
export class ContentModule { }
