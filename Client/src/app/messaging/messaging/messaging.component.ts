import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Inject } from '@angular/core';
import { SendDialogComponent } from '../send-dialog/send-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { MatButtonModule } from '@angular/material';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
  providers: [MessageService, AuthService]
})

export class MessagingComponent implements OnInit {

  currentUser: any;
  msg: any;
  div: Boolean;
  inbox: any[];
  sent: any[];
  displayedColumns = ['sender', 'body', 'sentAt', 'delete'];
  displayedColumns1 = ['recipient', 'body', 'sentAt', 'delete'];

  constructor(private messageService: MessageService, private authService: AuthService, public dialog: MatDialog) { }

  openDialog(): void {
    let dialogRef = this.dialog.open(SendDialogComponent, {
      width: '600px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['username', 'isChild'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      if (self.currentUser.isChild) {
        self.div = true;
      } else {
        self.div = false;
        self.getInbox();
        self.getSent();
      }
    });
  }

  getInbox(): void {
    const self = this;
    this.messageService.getInbox(this.currentUser.username).subscribe(function (msgs) {
      self.inbox = msgs.data;
    });
  }

  getSent(): void {
    const self = this;
    this.messageService.getSent(this.currentUser.username).subscribe(function (msgs) {
      self.sent = msgs.data;
    });
  }

  deleteMessage(message): void {
    const self = this;
    this.messageService.deleteMessage(message).subscribe(function (res) {
    });
  }
}
