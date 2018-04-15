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
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from './content.service';
import { ContentViewComponent } from './content-view/content-view.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafeResourceUrlPipe } from './safe-resource-url.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';
import { AdminModule } from '../admin/admin.module';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    FlexLayoutModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    QuillEditorModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSelectModule,
    AdminModule,
    MatRadioModule,
    InfiniteScrollModule,
    SharedModule
  ],
  providers: [ContentService],
  declarations: [ContentEditComponent, ContentListViewComponent, ContentViewComponent, SafeResourceUrlPipe, SafeHtmlPipe]
})
export class ContentModule { }
