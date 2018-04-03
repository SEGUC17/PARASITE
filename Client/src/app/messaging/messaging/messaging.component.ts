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

  Body: String = '';
  Sender: String = '';
  Receiver: String = '';
  currentUser: any;
  username: String;
  isChild: Boolean;
  msg: any;
  div1: Boolean;
  div2: Boolean;
  div3: Boolean;
  inbox: any[];
  sent: any[];
  x: Boolean = false;
  displayedColumns = ['sender', 'body', 'sentAt', 'delete'];
  displayedColumns1 = ['recipient', 'body', 'sentAt', 'delete'];


  constructor(private messageService: MessageService, private authService: AuthService, public dialog: MatDialog) {
    /*this.currentUser = this.authService.getUser();
    this.username = this.currentUser.username;
    this.isChild = this.currentUser.isChild;*/
  }

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
    // console.log(this.currentUser.username);

    if (this.x) {
      this.div3 = true;
    } else {
      this.div3 = false;
      this.getInbox();
      this.getSent();
    }
  }

  send(): void {
    if (this.Receiver === '') {
      this.div1 = true;
    }

    if (this.Body === '') {
      this.div2 = true;
    } else {
      this.msg = { 'body': this.Body, 'recipient': this.Receiver, 'sender': this.Sender };
      this.messageService.send(this.msg)
        .subscribe(res => console.log(res));
    }
  }

  getInbox(): void {
    const self = this;
    this.messageService.getInbox('sarah').subscribe(function (msgs) {
      self.inbox = msgs.data;
    });
  }

  getSent(): void {
    const self = this;
    this.messageService.getSent('sarah').subscribe(function (msgs) {
      self.sent = msgs.data;
    });
  }

  deleteMessage(message): void {
    const self = this;
    this.messageService.deleteMessage(message).subscribe(function (res) {
    });
  }
}
