import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentRoutingModule } from './content-routing.module';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { MatCardModule } from '@angular/material/card';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentService } from './content.service';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    FlexLayoutModule,
    FormsModule,
    QuillEditorModule,
    MatCardModule,
    MatChipsModule
  ],
  providers: [ContentService],
  declarations: [ContentEditComponent, ContentListViewComponent]
})
export class ContentModule { }
