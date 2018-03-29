import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentRoutingModule } from './content-routing.module';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    FormsModule,
    QuillEditorModule
  ],
  declarations: [ContentEditComponent, ContentListViewComponent]
})
export class ContentModule { }
