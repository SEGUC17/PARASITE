import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from './messaging.service';
import { AuthService } from '../auth/auth.service';
import { MatTableModule, MatTab, MatTabsModule, MatDialogModule, MatButtonModule, MatCardModule, MatListModule } from '@angular/material';
import { SendDialogComponent } from './send-dialog/send-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';
import { SingleMailComponent } from './single-mail/single-mail.component';
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
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule
  ],
  declarations: [MessagingComponent, SendDialogComponent, SingleMailComponent],
  entryComponents: [SendDialogComponent]
})
export class MessagingModule { }

