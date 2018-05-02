import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentRoutingModule } from './content-routing.module';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { MatCardModule } from '@angular/material/card';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { MatChipsModule } from '@angular/material/chips';
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
import { SafeResourceUrlPipe } from '../../pipe/safe-resource-url.pipe';
import { VideoIdExtractorPipe } from './video-id-extractor.pipe';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { DiscussionService } from '../discussion.service';
import { FileUploadModule } from 'ng2-file-upload';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { YoutubeApiService } from './youtube-api.service';
import { ContentRedirectorComponent } from './content-redirector/content-redirector.component';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    FormsModule,
    MatStepperModule,
    MatIconModule,
    QuillEditorModule,
    MatChipsModule,
    SharedModule,
    FileUploadModule,
    LoadingBarModule.forRoot(),
    TranslateModule.forChild()
  ],
  providers: [
    ContentService,
    DiscussionService,
    VideoIdExtractorPipe,
    YoutubeApiService
  ],
  declarations: [
    ContentEditComponent,
    ContentListViewComponent,
    ContentViewComponent,
    SafeResourceUrlPipe,
    VideoIdExtractorPipe,
    SafeHtmlPipe,
    YoutubePlayerComponent,
    ContentRedirectorComponent
  ]
})
export class ContentModule { }
