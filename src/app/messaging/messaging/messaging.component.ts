import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Inject } from '@angular/core';
import { SendDialogComponent } from '../send-dialog/send-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { SingleMailComponent } from '../single-mail/single-mail.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  providers: [MessageService, AuthService, ToastrService, TranslateService]
})

export class MessagingComponent implements OnInit {

  currentUser: any; // the currently logged in user
  inbox: any[];
  sent: any[];
  contacts: any[];
  avatars: any[];
  flag: Boolean = true;
  // send to contact
  replyTo: string;
  Body: String = '';
  msg: any;
  allisWell: Boolean = true;
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
    'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked', 'avatar'];

  constructor(private messageService: MessageService, private authService: AuthService, public dialog: MatDialog,
    private router: Router, private toastrService: ToastrService, private _TranslateService: TranslateService) { }

  openDialog(): void {
    $('#send').modal('show');
  }

  openReplyDialog(username: string): void {
    this.replyTo = username;
    $('#reply').modal('show');
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['_id', 'username', 'isChild', 'avatar'];
    // get info of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      self.getInbox();
      self.getSent();
      self.getContacts();
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

  // getting a list of recently contacted users
  getContacts(): void {
    const self = this;
    this.messageService.getContacts(this.currentUser.username).subscribe(function (contacts) {
      self.contacts = contacts.data;
    });
  }

  setMessage(message: any): void {
    this.messageService.read(message).subscribe();
    this.messageService.setMessage(message);
  }

  reply(): void {
    const self = this;

    if (this.Body === '') {
      self._TranslateService.get('MESSAGING.TOASTR.EMPTY_MSG').subscribe(function (translation) {
        self.toastrService.warning(translation);

      });
    } else {
      this.authService.getAnotherUserData(this.UserList, this.replyTo.toString()).subscribe((user) => {
        const list = user.data.blocked;
        for (let i = 0; i < user.data.blocked.length; i++) {
          if (this.currentUser.username === list[i]) {
            self._TranslateService.get('MESSAGING.TOASTR.SEND_SELF').subscribe(function (translation) {
              self.toastrService.error(translation);

            });
            this.allisWell = false;
          } // end if
        }// end for

        // make a POST request using messaging service
        if (this.allisWell === true) {
          this.msg = {
            'body': this.Body, 'recipient': this.replyTo, 'recipientAvatar': user.data.avatar,
            'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar
          };
          this.messageService.send(this.msg)
            .subscribe(function (res) {
              self._TranslateService.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function (translation) {
                self.toastrService.success(translation);

              });
              self.getSent();
            });
        }// end if
      });
    }
  }
}// end class
