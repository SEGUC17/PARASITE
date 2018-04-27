import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from './messaging.service';
import { AuthService } from '../auth/auth.service';
import { MatTableModule, MatTab, MatTabsModule, MatDialogModule, MatButtonModule, MatCardModule, MatListModule } from '@angular/material';
import { SendDialogComponent } from './send-dialog/send-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material';
import { ReplyDialogComponent } from './reply-dialog/reply-dialog.component';
import {MatChipsModule} from '@angular/material/chips';
import { ForwardDialogComponent } from './forward-dialog/forward-dialog.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  providers: [MessageService, AuthService, MatDialog, ToastrService],
  imports: [
    MessagingRoutingModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule
  ],
  declarations: [MessagingComponent, SendDialogComponent, ReplyDialogComponent, ForwardDialogComponent],
  entryComponents: [SendDialogComponent, ReplyDialogComponent, ForwardDialogComponent]
})
export class MessagingModule { }

