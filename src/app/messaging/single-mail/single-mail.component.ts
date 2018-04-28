import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { AuthService } from '../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
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
  id: any;
  message: any;
  blockedUser: any;

  msg: any;
  allisWell: Boolean = true;
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  // reply
  Body: String = '';

  // forward
  Recipient: String = '';

  constructor(private messageService: MessageService, private authService: AuthService, private route: ActivatedRoute,
    public dialog: MatDialog, private toastrService: ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.sender = params['sender'];
      this.recipient = params['recipient'];
      this.body = params['body'];
      this.sentAt = params['sentAt'];
      this.id = params['id'];
  });
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['_id', 'username', 'isChild'];
    // get info of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      self.message = {'_id': self.id, 'body': self.body, 'recipient': self.recipient, 'sender': self.currentUser.username};
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

  openReplyDialog(): void {
    $('#reply').modal('show');
  }

  openForwardDialog(): void {
    $('#forward').modal('show');
  }

  reply(): void {
    const self = this;

    if (this.Body === '') {
      this.toastrService.warning('You can\'t send an empty message.');
    } else {
       // create a message object with the info the user entered
       this.msg = {'body': this.Body, 'recipient': this.sender, 'sender': this.currentUser.username};

       this.authService.getAnotherUserData(this.UserList, this.sender.toString()).subscribe((user)  => {
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
        this.messageService.send(this.msg)
         .subscribe(function(res) {
           self.toastrService.success('Message was sent!');
         });
       }// end if
    });
   }
}

forward(): void {
  const self = this;

  if (this.Recipient === '') {
    this.toastrService.warning('Please specify a recipient.');
  } else {
  // create a message object with the info the user entered
  this.msg = {'body': this.body, 'recipient': this.Recipient, 'sender': this.currentUser.username};

  this.authService.getAnotherUserData(this.UserList, this.Recipient.toString()).subscribe((user)  => {
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
      this.messageService.send(this.msg)
      .subscribe(function(res) {
        self.toastrService.success('Message was sent!');
      });
    }// end if
  });
}
}

// deleteing a message from inbox or sent (on pressing delete button)
deleteMessage(): void {
  const self = this;
  // make DELETE request using messaging service
  this.messageService.deleteMessage(this.message).subscribe(function (res) {
  });
}

// blocking the reciever of the message from messaging the current user again
block(): void {
  const self = this;
  // if the currentUser is the sender then the receipent is the person to block
 if (this.recipient !== this.currentUser.username ) {
    console.log('receipient is:' + this.recipient);
    this.blockedUser = this.recipient;
    // else the recipient is the currentUser & the sender is the person to block
  } else {
    console.log(this.sender);
    this.blockedUser = this.sender;
}
  console.log('blocked user is:' + this.blockedUser);
  this.messageService.block(this.blockedUser, this.currentUser).subscribe(function (res) {
  alert(res.msg);
});
}// end method

}