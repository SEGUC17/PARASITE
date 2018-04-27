import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html',
  styleUrls: ['./reply-dialog.component..scss']
})
export class ReplyDialogComponent implements OnInit {

  Body: String = '';
  msg: any;
  currentUser: any;
  div2: Boolean;
  div3: Boolean;
  div4: Boolean; // div for blocked user
  allisWell: Boolean = true;
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  constructor(public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private messageService: MessageService,
    private authService: AuthService, private toastrService: ToastrService) {}

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
    const self = this;

    if (this.Body === '') {
      this.div2 = true;
      this.div3 = false;
    } else {
       // create a message object with the info the user entered
       this.msg = {'body': this.Body, 'recipient': this.data.replyTo, 'sender': this.currentUser.username};

       this.authService.getAnotherUserData(this.UserList, this.data.replyTo.toString()).subscribe((user)  => {
        const list = user.data.blocked;
        for ( let i = 0 ; i < user.data.blocked.length ; i++) {
          if ( this.currentUser.username === list[i] ) {
            console.log('blocked is:', list[i]);
            this.div4 = true;
            this.allisWell = false;
          } // end if
        }// end for

       // make a POST request using messaging service
       if ( this.allisWell === true) {
        this.messageService.send(this.msg)
         .subscribe(function(res) {
          self.div3 = true;
          self.div2 = false;
          self.div4 = false;
         });
         }// end if
    });
   }// end method
}// end class
}
