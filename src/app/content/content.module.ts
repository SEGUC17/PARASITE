import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { ContentRoutingModule } from './content-routing.module';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { ContentListViewComponent } from './content-list-view/content-list-view.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material';
import { ContentService } from './content.service';
import { ContentViewComponent } from './content-view/content-view.component';
import { SafeResourceUrlPipe } from '../../pipe/safe-resource-url.pipe';
import { VideoIdExtractorPipe } from './video-id-extractor.pipe';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { SharedModule } from '../shared/shared.module';
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
