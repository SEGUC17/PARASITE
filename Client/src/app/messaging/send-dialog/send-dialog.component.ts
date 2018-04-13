import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss']
})

export class SendDialogComponent implements OnInit {

  Body: String = '';
  Receiver: String = '';
  div1: Boolean; // div for empty recipient error message
  div2: Boolean; // div for empty body error message
  div3: Boolean; // div for sent message success notification
  msg: any;
  currentUser: any; // currently logged in user

  constructor(public dialogRef: MatDialogRef<SendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private messageService: MessageService, private authService: AuthService) { }

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

        // make a POST request using messaging service
        this.messageService.send(this.msg)
         .subscribe(function() {
          self.div3 = true;
          self.div1 = false;
          self.div2 = false;
         });
        }
      }

    }
}
