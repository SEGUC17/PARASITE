import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Inject } from '@angular/core';
import { SendDialogComponent } from '../send-dialog/send-dialog.component';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component';
import { ForwardDialogComponent } from '../forward-dialog/forward-dialog.component';
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
  blockedUser: any;
  sender: any;
  receipient: any;
  displayedColumns = ['sender', 'body', 'sentAt', 'reply', 'forward', 'delete', 'block'];
  displayedColumns1 = ['recipient', 'body', 'sentAt', 'reply', 'forward', 'delete', 'block'];
  contacts: any[];

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

  openReplyDialog(user: any): void {
    let replydialog = this.dialog.open(ReplyDialogComponent, {
      width: '600px',
      height: '500px',
      data: {
        replyTo: user
      }
    });

    replydialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  openForwardDialog(message): void {
    let dialogRef = this.dialog.open(ForwardDialogComponent, {
      width: '600px',
      height: '500px'
      data: {
        body: message.body;
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['_id', 'username', 'isChild'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      console.log(self.currentUser.username);
      console.log(self.currentUser._id);
      if (self.currentUser.isChild) {
        self.div = true; // logged in user is a child
      } else {
        self.div = false;
        self.getInbox();
        self.getSent();
        self.getContacts();
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

// blocking the reciever of the message from messaging the current user again
  block(message): void {
    const self = this;
    //  if the currentUser is the sender then the receipent is the person to block
   if ( message.recipient !== this.currentUser.username ) {
      console.log('receipient is:' + message.recipient);
      this.blockedUser = message.recipient;
      // else the recipient is the currentUser & the sender is the person to block
    } else {
      console.log(message.sender);
        this.blockedUser = message.sender;
  }
    console.log('blocked user is:' + this.blockedUser);
    this.messageService.block(this.blockedUser, this.currentUser).subscribe(function (res) {
    alert(res.msg);
  });
 }// end method

 getContacts(): void {
  const self = this;
  this.messageService.getContacts(this.currentUser.username).subscribe(function (contacts) {
    self.contacts = contacts.data;
  });
}

}// end class
