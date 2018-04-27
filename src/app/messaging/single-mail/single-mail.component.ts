import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { AuthService } from '../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component';
declare const $: any;

@Component({
  selector: 'app-single-mail',
  templateUrl: './single-mail.component.html',
  styleUrls: ['./single-mail.component.scss'],
  providers: [MessageService, AuthService]
})
export class SingleMailComponent implements OnInit {

  currentUser: any;
  contacts: any[];
  sender: string;
  recipient: string;
  body: string;
  sentAt: any;

  constructor(private messageService: MessageService, private authService: AuthService, private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      this.sender = params['sender'];
      this.recipient = params['recipient'];
      this.body = params['body'];
      this.sentAt = params['sentAt'];
  });
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['_id', 'username', 'isChild'];
    // get info of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      self.getContacts();
    });
  }

  getContacts(): void {
    const self = this;
    this.messageService.getContacts(this.currentUser.username).subscribe(function (contacts) {
      self.contacts = contacts.data;
    });
  }

  openDialog(): void {
    $('#send').modal('show');
  }

}
