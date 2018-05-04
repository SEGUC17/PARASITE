import { Component, OnInit, Output, Input } from '@angular/core';
import { MessageService } from '../../../messaging/messaging.service';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-direct-messaging',
  templateUrl: './direct-messaging.component.html',
  styleUrls: ['./direct-messaging.component.scss'],
  providers: [MessageService, AuthService]
})
export class DirectMessagingComponent implements OnInit {

  currentUser: any;
  contacts: any[];
  sender: string;
  recipient: string;
  body: string;
  sentAt: any;
  id: any;
  message: any;
  blockedUser: any;
  allIsWell: Boolean = true;
  recipientDisplay: string;
  senderDisplay: string;
  profile1: string;
  profile2: string;

  msg: any;
  allisWell: Boolean = true;
  list: any[];
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
    'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  // reply
  Body: String = '';
  gazar: string;
  @Input()
  set receipient(receipent: string) {
    this.gazar = receipent;

  }

  // forward
  Recipient: String = '';

  constructor(private messageService: MessageService, private authService: AuthService, private route: ActivatedRoute,
    public dialog: MatDialog, private toastrService: ToastrService, public translate: TranslateService) {
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['_id', 'username', 'isChild', 'blocked'];
    // get info of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      self.sender = res.data.username;
      self.message = { '_id': self.id, 'body': self.body, 'recipient': self.recipient, 'sender': self.currentUser.username };
      if (self.recipient !== self.currentUser.username) {
        self.senderDisplay = 'me';
        self.recipientDisplay = self.recipient;
        self.profile1 = '/profile/' + self.currentUser.username;
        self.profile2 = '/profile/' + self.recipient;
      } else {
        self.recipientDisplay = 'me';
        self.senderDisplay = self.sender;
        self.profile1 = '/profile/' + self.sender;
        self.profile2 = '/profile/' + self.currentUser.username;
      }
    });
  }

  getContacts(): void {
    const self = this;
    this.messageService.getContacts(this.currentUser.username).subscribe(function (contacts) {
      self.contacts = contacts.data;
    });
  }
  reply(): void {
    const self = this;

    if (this.Body === '') {
      this.toastrService.warning('You can\'t send an empty message.');
    } else {
      this.authService.getAnotherUserData(this.UserList, this.sender.toString()).subscribe((user) => {
        this.list = user.data.blocked;
        for (let i = 0; i < user.data.blocked.length; i++) {
          if (this.currentUser.username === this.list[i]) {
            this.toastrService.error('Sorry, you are blocked.');
            this.allisWell = false;
          } // end if
        }// end for

        // make a POST request using messaging service
        if (this.allisWell === true) {
          if (this.recipient !== this.currentUser.username) {
            this.msg = { 'body': this.Body, 'recipient': this.gazar, 'sender': this.currentUser.username };
          } else {
            this.msg = { 'body': this.Body, 'recipient': this.sender, 'sender': this.currentUser.username };
          }
          this.messageService.send(this.msg)
            .subscribe(function (res) {
              self.toastrService.success('Message was sent!');
            });
        }// end if
      });
    }
  }

}
