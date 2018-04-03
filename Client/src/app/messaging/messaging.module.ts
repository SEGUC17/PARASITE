import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from './messaging.service';
import { AuthService } from '../auth/auth.service';
import { MatTableModule, MatTab, MatTabsModule, MatDialogModule, MatButtonModule, MatCardModule } from '@angular/material';
import { SendDialogComponent } from './send-dialog/send-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  providers: [MessageService, AuthService, MatDialog],
  imports: [
    MessagingRoutingModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  declarations: [MessagingComponent, SendDialogComponent],
  entryComponents: [SendDialogComponent]
})
export class MessagingModule { }

