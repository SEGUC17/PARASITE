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
<<<<<<< HEAD
=======
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from './content.service';
import { ContentViewComponent } from './content-view/content-view.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    FlexLayoutModule,
    FormsModule,
<<<<<<< HEAD
    QuillEditorModule,
    MatCardModule,
    MatChipsModule
  ],
  declarations: [ContentEditComponent, ContentListViewComponent]
=======
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    QuillEditorModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatTabsModule
  ],
  providers: [ContentService],
  declarations: [ContentEditComponent, ContentListViewComponent, ContentViewComponent]
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
})
export class ContentModule { }
