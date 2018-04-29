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
declare const $: any;

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  providers: [MessageService, AuthService, ToastrService]
})

export class MessagingComponent implements OnInit {

  currentUser: any; // the currently logged in user
  inbox: any[];
  sent: any[];
  contacts: any[];
  avatars: any[];

  // send to contact
  replyTo: string;
  Body: String = '';
  msg: any;
  allisWell: Boolean = true;
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  constructor(private messageService: MessageService, private authService: AuthService, public dialog: MatDialog,
    private router: Router, private toastrService: ToastrService) { }

  openDialog(): void {
    $('#send').modal('show');
  }

  openReplyDialog(username: string): void {
    this.replyTo = username;
    $('#reply').modal('show');
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['_id', 'username', 'isChild'];
    // get info of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      console.log(self.currentUser.username);
      console.log(self.currentUser._id);
      self.getInbox();
      // self.getAvatars();
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

 setMessage(message): void {
   let currMsg: any = {
     queryParams: {
       'body': message.body,
       'recipient': message.recipient,
       'sender': message.sender,
       'sentAt': message.sentAt,
       'id': message._id
     }
   };

   this.router.navigate(['/single-mail'], currMsg);
 }

 reply(): void {
  const self = this;

  if (this.Body === '') {
    this.toastrService.warning('You can\'t send an empty message.');
  } else {
     this.authService.getAnotherUserData(this.UserList, this.replyTo.toString()).subscribe((user)  => {
      const list = user.data.blocked;
      for ( let i = 0 ; i < user.data.blocked.length ; i++) {
        if ( this.currentUser.username === list[i] ) {
          console.log('blocked is:', list[i]);
          this.toastrService.error('Sorry, you are blocked.');
          this.allisWell = false;
        } // end if
      }// end for

     // make a POST request using messaging service
     if (this.allisWell === true) {
      this.msg = {'body': this.Body, 'recipient': this.replyTo, 'sender': this.currentUser.username};
      this.messageService.send(this.msg)
       .subscribe(function(res) {
         self.toastrService.success('Message was sent!');
         self.getSent();
       });
     }// end if
  });
 }
}

/*getAvatars(): void {
  for (let i = 0 ; i < this.inbox.length ; i++) {
    this.authService.getAnotherUserData(['avatar'], this.inbox[i].sender.toString()).subscribe((user) => {
      this.avatars.push(user.data.avatar);
    });
  }

}*/

}// end class
