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
  styleUrls: ['./messaging.component.scss'],
  providers: [MessageService, AuthService]
})

export class MessagingComponent implements OnInit {

  currentUser: any; // the currently logged in user
  msg: any;
  div: Boolean; // controls appearance of a div notifying the user that they can't access messaging (in case the logged in user is a child)
  inbox: any[];
  sent: any[];
  displayedColumns = ['sender', 'body', 'sentAt', 'delete'];
  displayedColumns1 = ['recipient', 'body', 'sentAt', 'delete'];

  constructor(private messageService: MessageService, private authService: AuthService, public dialog: MatDialog) { }

  // opening the send dialog (on pressing the compose button)
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
        self.div = true; // logged in user is a child
      } else {
        self.div = false;
        self.getInbox();
        self.getSent();
      }
    });
  }

  // retreive inbox of logged in user (called when page is loaded)
  getInbox(): void {
    const self = this;
    // make GET request using messaging service
    this.messageService.getInbox(this.currentUser.username).subscribe(function (msgs) {
      self.inbox = msgs.data;
    });
  }

  // retreive sent messages of logged in user (called when page is loaded)
  getSent(): void {
    const self = this;
    // make GET request using messaging service
    this.messageService.getSent(this.currentUser.username).subscribe(function (msgs) {
      self.sent = msgs.data;
    });
  }

  // deleteing a message from inbox or sent (on pressing delete button)
  deleteMessage(message): void {
    const self = this;
    // make DELETE request using messaging service
    this.messageService.deleteMessage(message).subscribe(function (res) {
    });
  }
}
