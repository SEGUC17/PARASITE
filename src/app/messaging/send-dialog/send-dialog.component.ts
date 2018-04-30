import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss']
})

export class SendDialogComponent implements OnInit {

  Body: String = '';
  Receiver: String = '' ;
  user: any;
  allisWell: Boolean = true;
  msg: any;
  currentUser: any; // currently logged in user
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  constructor(private messageService: MessageService, private authService: AuthService,
    private toastrService: ToastrService) { }


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
    // notify user if recipient field is empty
    if (this.Receiver === '') {
      this.allisWell = false;
      self.toastrService.warning('Please specify a recipient.');
    } else {
      // notify user if message body is empty
      if (this.Body === '') {
        this.allisWell = false;
        self.toastrService.warning('You can\'t send an empty message.');
      } else {
        // create a message object with the info the user entered
        this.msg = {'avatar': this.currentUser.avatar, 'body': this.Body, 'recipient': this.Receiver, 'sender': this.currentUser.username};

        // retrieveing the reciepient's info as an object
        this.authService.getAnotherUserData(this.UserList, this.Receiver.toString()).subscribe((user)  => {
          if (!user.data) {
            self.allisWell = false;
            self.toastrService.error('Please enter a valid username.');
          } else {
            console.log('length of array is: ', user.data.blocked.length);
            const list = user.data.blocked;
            for ( let i = 0 ; i < user.data.blocked.length ; i++) {
              if ( self.currentUser.username === list[i] ) {
                console.log('blocked is:', list[i]);
                self.toastrService.error('Sorry, you are blocked.');
                self.allisWell = false;
              } // end if
            }// end for
           //       console.log('allIsWell', this.allisWell);
            if ( self.allisWell === true) {
              self.messageService.send(this.msg)
              .subscribe(function(res) {
                self.toastrService.success('Message was sent!');
              });
            }// end if
          }
        });

        if ( this.Receiver.match(/\S+@\S+\.\S+/)) {
          this.messageService.send(this.msg)
          .subscribe(function(res) {
            self.toastrService.success('Message was sent!');
          });
        }// end if
      }// end 2nd else

    }// end else
  }// end method

}// end class
