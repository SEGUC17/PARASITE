import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { AuthService } from '../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
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
  senderAvatar: string;
  recipientAvatar: string;
  message: any;
  blockedUser: any;
  allIsWell: Boolean = true;
  otherUser: string;

  recipientDisplay: string;
  senderDisplay: string;
  avatarDisplay: string;
  profile1: string;
  profile2: string;

  msg: any;
  allisWell: Boolean = true;
  list: any [];
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked', 'avatar'];

  // reply
  Body: String = '';
  replyTo: string;

  // forward
  Recipient: String = '';

  constructor(private messageService: MessageService, private authService: AuthService, private route: ActivatedRoute,
    private toastrService: ToastrService) {}

  ngOnInit() {
    const self = this;
    this.message = this.messageService.getMessage();
    this.sender = this.message.sender;
    this.recipient = this.message.recipient;
    this.body = this.message.body;
    this.sentAt = this.message.sentAt;
    this.senderAvatar = this.message.senderAvatar;
    this.recipientAvatar = this.message.recipientAvatar;

    const userDataColumns = ['_id', 'username', 'isChild', 'blocked', 'avatar'];
    // get info of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
      self.getContacts();
      console.log(self.contacts);
      if (self.recipient !== self.currentUser.username) {
        self.senderDisplay = 'me';
        self.recipientDisplay = self.recipient;
        self.avatarDisplay = self.recipientAvatar;
        self.profile1 = '/profile/' + self.currentUser.username;
        self.profile2 = '/profile/' + self.recipient;
      } else {
        if (self.sender === self.recipient) {
          self.senderDisplay = 'me';
          self.recipientDisplay = 'me';
          self.avatarDisplay = self.recipientAvatar;
          self.profile1 = '/profile/' + self.currentUser.username;
          self.profile2 = '/profile/' + self.currentUser.username;
        } else {
          self.recipientDisplay = 'me';
          self.senderDisplay = self.sender;
          self.avatarDisplay = self.senderAvatar;
          self.profile1 = '/profile/' + self.sender;
          self.profile2 = '/profile/' + self.currentUser.username;
        }
      }
    });
  }

  getContacts(): void {
    const self = this;
    this.messageService.getContacts(this.currentUser.username).subscribe(function (contacts) {
      self.contacts = contacts.data;
      console.log(self.contacts);
    });
  }

  openDialog(): void {
    $('#send').modal('show');
  }

  openReplyDialog(user: any): void {
    if (user !== this.currentUser.username ) {
        this.replyTo = user;
      } else {
        this.replyTo = this.sender;
    }
    $('#reply').modal('show');
  }

  openForwardDialog(): void {
    $('#forward').modal('show');
  }

  openDeleteDialog(): void {
    $('#delete').modal('show');
  }

  reply(): void {
    const self = this;
    this.allisWell = true;


    if ( self.replyTo.match(/\S+@\S+\.\S+/) && self.Body !== '') {
      this.msg = {'body': this.Body, 'recipient': this.replyTo,
        'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar};
      this.messageService.send(self.msg)
      .subscribe(function(res) {
        self.toastrService.success('Message was sent!');
      });
    }// end if
    if (this.Body === '') {
      this.allisWell = false;
      this.toastrService.warning('You can\'t send an empty message.');
      this.allisWell = false;
    } else {
       this.authService.getAnotherUserData(this.UserList, this.replyTo.toString()).subscribe((user)  => {
        this.list = user.data.blocked;
        for ( let i = 0 ; i < user.data.blocked.length ; i++) {
          if ( this.currentUser.username === this.list[i] ) {
            console.log('blocked is:', this.list[i]);
            this.toastrService.error('Sorry, you are blocked.');
            this.allisWell = false;
          } // end if
        }// end for

       // make a POST request using messaging service
       if (this.allisWell === true && !self.replyTo.match(/\S+@\S+\.\S+/)) {
        this.msg = {'body': this.Body, 'recipient': this.replyTo, 'recipientAvatar': user.data.avatar,
        'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar};
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
  this.allisWell = true;

  if (this.Recipient === '') {
    this.allisWell = false;
    this.toastrService.warning('Please specify a recipient.');
    this.allisWell = false;
  } else {
  this.authService.getAnotherUserData(this.UserList, this.Recipient.toString()).subscribe((user)  => {
    if (!user.data) {
      self.allisWell = false;
      self.toastrService.error('Please enter a valid username.');
    } else {
    this.list = user.data.blocked;
    for ( let i = 0 ; i < user.data.blocked.length ; i++) {
      if ( this.currentUser.username === this.list[i] ) {
        console.log('blocked is:', this.list[i]);
        this.toastrService.error('Sorry, you are blocked.');
        this.allisWell = false;
      } // end if
    }// end for

    // make a POST request using messaging service
    if (this.allisWell === true) {
      // create a message object with the info the user entered
      this.msg = {'body': this.body, 'recipient': this.Recipient, 'recipientAvatar': user.data.avatar,
      'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar};
      this.messageService.send(this.msg)
      .subscribe(function(res) {
        self.toastrService.success('Message was sent!');
      });
    }// end if
  }
});
}
}

// deleteing a message from inbox or sent (on pressing delete button)
deleteMessage(): void {
  const self = this;
  // make DELETE request using messaging service
  this.messageService.deleteMessage(this.message).subscribe(function (res) {
    self.toastrService.success('Message was deleted');
  });
}

// blocking the reciever of the message from messaging the current user again
block(): void {
  const self = this;
  //  if the currentUser is the sender then the receipent is the person to block
 if (this.recipient !== this.currentUser.username ) {
   console.log('receipient is:' + this.recipient);
    this.blockedUser = this.recipient;
    // else the recipient is the currentUser & the sender is the person to block
  } else {
   console.log(this.sender);
    this.blockedUser = this.sender;
   console.log('blocked user is:' + this.blockedUser);
  }
  if (this.blockedUser === this.currentUser.username ) {
      this.toastrService.error('Sorry, you can\'t block yourself!');
      this.allIsWell = false;
  }

  console.log('blocklist from currentUser: ', this.currentUser.blocked);

  for (let i = 0 ; i < this.currentUser.blocked.length; i++) {
       if (this.currentUser.blocked[i] === this.blockedUser) {
           self.toastrService.error('This user is already blocked!');
           this.allIsWell = false;
   console.log('all is not well, dup found: ', this.blockedUser);
       }// end if
  } // end for
  if (this.allIsWell === true) {
    this.currentUser.blocked.push(this.blockedUser);
  this.messageService.block(this.blockedUser, this.currentUser).subscribe(function (res) {
    if (res.msg) {
      self.toastrService.success(res.msg);
    }// end if
});
}// end if
}// end method

}
