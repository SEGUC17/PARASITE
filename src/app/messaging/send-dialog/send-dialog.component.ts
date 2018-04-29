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
  Receiver: String = '';
  user: any;
  allisWell: Boolean = true;
  msg: any;
  currentUser: any; // currently logged in user
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  constructor(public dialogRef: MatDialogRef<SendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private messageService: MessageService, private authService: AuthService,
    private toastrService: ToastrService) { }

  onNoClick(): void {
      this.dialogRef.close();
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['username'];
    // getting username of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
    });
  }

  send(): void {
    // notify user if recipient field is empty
    if (this.Receiver === '') {
      this.toastrService.warning('Please specify a recipient.');
    } else {
      // notify user if message body is empty
      if (this.Body === '') {
        this.toastrService.warning('You can\'t send an empty message.');
      } else {
        const self = this;
        // create a message object with the info the user entered
        this.msg = {'body': this.Body, 'recipient': this.Receiver, 'sender': this.currentUser.username};

        // retrieveing the reciepient's info as an object
        this.authService.getAnotherUserData(this.UserList, this.Receiver.toString()).subscribe((user)  => {
          if (!user) {
            this.toastrService.error('Please enter a valid username.');
          } else {
            console.log('length of array is: ', user.data.blocked.length);
            const list = user.data.blocked;
            for ( let i = 0 ; i < user.data.blocked.length ; i++) {
              if ( this.currentUser.username === list[i] ) {
                console.log('blocked is:', list[i]);
                this.toastrService.error('Sorry, you are blocked.');
                this.allisWell = false;
              } // end if
            }// end for

            if ( this.allisWell === true) {
              this.messageService.send(this.msg)
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
