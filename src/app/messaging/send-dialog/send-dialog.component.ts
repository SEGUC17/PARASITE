import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss'],
  providers: [ToastrService]
})

export class SendDialogComponent implements OnInit {

  Body: String = '';
 Receiver: String = '';
  user: any;
  allisWell: boolean;
  msg: any;
  currentUser: any; // currently logged in user
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked', 'avatar'];

  constructor(private messageService: MessageService, private authService: AuthService,
    private toastrService: ToastrService, private _TranslateService: TranslateService) { }


  ngOnInit() {
    const self = this;
    const userDataColumns = ['username', 'avatar'];
    // getting username of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
    });
  }

  send(): void {
    this.allisWell = true;
    const self = this;
    this.allisWell = true;
    // notify user if recipient field is empty
    if (self.Receiver === '') {
      self.allisWell = false;
      this._TranslateService.get('MESSAGING.TOASTR.ENTER_RECIPIENT').subscribe(function(translation){
        self.toastrService.warning(translation);
      });
    } else {
      // notify user if message body is empty
      if (self.Body === '') {
        self.allisWell = false;
        this._TranslateService.get('MESSAGING.TOASTR.EMPTY_MSG').subscribe(function(translation) {
          self.toastrService.warning(translation);
        });
      } else {
        // create a message object with the info the user entered
        self.msg = {'body': self.Body, 'recipient': self.Receiver, 'recipientAvatar': '',
        'sender': this.currentUser.username, 'senderAvatar': this.currentUser.avatar};

        // retrieveing the reciepient's info as an object
        this.authService.getAnotherUserData(this.UserList, this.Receiver.toString()).subscribe((user)  => {
          if (!user.data) {
            self.allisWell = false;
            this._TranslateService.get('MESSAGING.TOASTR.VALID_NAME').subscribe(function(translation) {
              self.toastrService.error(translation);
            });
          } else {
            const list = user.data.blocked;
            for ( let i = 0 ; i < user.data.blocked.length ; i++) {
              if ( self.currentUser.username === list[i] ) {
                this._TranslateService.get('MESSAGING.TOASTR.BLOCKED').subscribe(function(translation) {
                  self.toastrService.error(translation);
                });
                self.allisWell = false;
              } // end if
            }// end for
           //       console.log('allIsWell', this.allisWell);
            if ( self.allisWell === true) {
              self.msg.recipientAvatar = user.data.avatar;
              self.messageService.send(this.msg)
              .subscribe(function(res) {
                self._TranslateService.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function(translation) {
                    self.toastrService.success(translation);
                });
              });
            }// end if
          }
        });

        if ( self.Receiver.match(/\S+@\S+\.\S+/)) {
          this.messageService.send(self.msg)
          .subscribe(function(res) {
            this._TranslateService.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function(translation) {
              self.toastrService.success(translation);

            });
          });
        }// end if
      }// end 2nd else

    }// end else
  }// end method

}// end class
