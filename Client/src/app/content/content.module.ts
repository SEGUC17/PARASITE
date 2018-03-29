import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentRoutingModule } from './content-routing.module';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { MatCardModule } from '@angular/material/card';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    FormsModule,
    QuillEditorModule,
    MatCardModule,
    MatChipsModule
  ],
  declarations: [ContentEditComponent, ContentListViewComponent]
})
export class ContentModule { }
