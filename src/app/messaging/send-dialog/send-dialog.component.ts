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
  div1: Boolean; // div for empty recipient error message
  div2: Boolean; // div for empty body error message
  div3: Boolean; // div for sent message success notification
  div4: Boolean; // div for blocked user
  div5: Boolean;
  allisWell: Boolean = true;
  msg: any;
  currentUser: any; // currently logged in user
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  constructor(public dialogRef: MatDialogRef<SendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private messageService: MessageService,
     private authService: AuthService, private toastrService: ToastrService) { }

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
      this.div1 = true;
      this.div2 = false;
      this.div3 = false;
    } else {
      // notify user if message body is empty
      if (this.Body === '') {
        this.div2 = true;
        this.div1 = false;
        this.div3 = false;
      } else {
        const self = this;
        // create a message object with the info the user entered
        this.msg = {'body': this.Body, 'recipient': this.Receiver, 'sender': this.currentUser.username};

        // retrieveing the reciepient's info as an object
        // console.log(this.Receiver.toString());
        this.authService.getAnotherUserData(this.UserList, this.Receiver.toString()).subscribe((user)  => {
          if (!user.data) {
            self.div1 = false;
            self.div2 = false;
            self.div5 = true;
          } else {
            console.log('length of array is: ', user.data.blocked.length);
            const list = user.data.blocked;
            for ( let i = 0 ; i < user.data.blocked.length ; i++) {
              if ( this.currentUser.username === list[i] ) {
                console.log('blocked is:', list[i]);
                this.div4 = true;
                this.allisWell = false;
              } // end if
            }// end for

            if ( this.allisWell === true) {
              this.messageService.send(this.msg)
              .subscribe(function(res) {
                self.div3 = true;
                self.div1 = false;
                self.div2 = false;
                self.div4 = false;
                self.div5 = false;
              });
            }// end if
          }
        });
      }// end 2nd else

    }// end else
  }// end method
}// end class
