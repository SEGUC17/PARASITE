import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { AuthService } from '../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
declare const $: any;

@Component({
  selector: 'app-single-mail',
  templateUrl: './single-mail.component.html',
  styleUrls: ['./single-mail.component.scss'],
  providers: [MessageService, AuthService, TranslateService]
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
    private toastrService: ToastrService, private _TranslateService: TranslateService) {}

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
      this.allisWell = false;
      this.msg = {'body': this.Body, 'recipient': this.replyTo,
        'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar};
      this.messageService.send(self.msg)
      .subscribe(function(res) {
        this._TranslateService.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function(translation) {
          self.toastrService.success(translation);

        });
      });
    }// end if

    if (this.Body === '') {
      this.allisWell = false;
      this._TranslateService.get('MESSAGING.TOASTR.EMPTY_MSG').subscribe(function(translation) {
        self.toastrService.warning(translation);

      });
      this.allisWell = false;
    } else {
       this.authService.getAnotherUserData(this.UserList, this.replyTo.toString()).subscribe((user)  => {
        this.list = user.data.blocked;
        for ( let i = 0 ; i < user.data.blocked.length ; i++) {
          if ( this.currentUser.username === this.list[i] ) {
            this._TranslateService.get('MESSAGING.TOASTR.BLOCKED').subscribe(function(translation) {
             self.toastrService.error(translation);
            });
            this.allisWell = false;
          } // end if
        }// end for

       // make a POST request using messaging service
       if (this.allisWell === true) {
        this.msg = {'body': this.Body, 'recipient': this.replyTo, 'recipientAvatar': user.data.avatar,
        'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar};
        this.messageService.send(this.msg)
         .subscribe(function(res) {

          self._TranslateService.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function(translation) {
          self.toastrService.success(translation);

        });
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
    self._TranslateService.get('MESSAGING.TOASTR.ENTER_RECIPIENT').subscribe(function(translation){
      self.toastrService.warning(translation);
    });     this.allisWell = false;
  } else {
  this.authService.getAnotherUserData(this.UserList, this.Recipient.toString()).subscribe((user)  => {
    if (!user.data) {
      self.allisWell = false;
      this._TranslateService.get('MESSAGING.TOASTR.VALID_NAME').subscribe(function(translation) {
        self.toastrService.error(translation);
      });    } else {
    this.list = user.data.blocked;
    for ( let i = 0 ; i < user.data.blocked.length ; i++) {
      if ( this.currentUser.username === this.list[i] ) {
        this._TranslateService.get('MESSAGING.TOASTR.BLOCKED').subscribe(function(translation) {
          self.toastrService.error(translation);
        });
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
        self._TranslateService.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function(translation) {
          self.toastrService.success(translation);

        });
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
    self._TranslateService.get('MESSAGING.TOASTR.MSG_DELETED').subscribe(function(translation) {
      self.toastrService.success(translation);

    });
  });
}

// blocking the reciever of the message from messaging the current user again
block(): void {
  const self = this;
  //  if the currentUser is the sender then the receipent is the person to block
 if (this.recipient !== this.currentUser.username ) {
    this.blockedUser = this.recipient;
    // else the recipient is the currentUser & the sender is the person to block
  } else {
    this.blockedUser = this.sender;
  }
  if (this.blockedUser === this.currentUser.username ) {
    self._TranslateService.get('MESSAGING.TOASTR.BLOCK_SELF').subscribe(function(translation) {
      self.toastrService.error(translation);
    });
      this.allIsWell = false;
  }


  for (let i = 0 ; i < this.currentUser.blocked.length; i++) {
       if (this.currentUser.blocked[i] === this.blockedUser) {
         self._TranslateService.get('MESSAGING.TOASTR.ALREADY_BLOCKED').subscribe(function(translation) {
          self.toastrService.error(translation);

         });
           this.allIsWell = false;
       }// end if
  } // end for
  if (this.allIsWell === true) {
    this.currentUser.blocked.push(this.blockedUser);
  self.messageService.block(this.blockedUser, this.currentUser).subscribe(function (res) {
    if (res.msg) {
      this.translate.get('MESSAGING.TOASTR.BLOCK').subscribe(function(translation) {
        self.toastrService.success(translation);

      });
    }// end if
});
}// end if
}// end method

}
