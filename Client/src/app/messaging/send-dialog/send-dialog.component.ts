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
  styleUrls: ['./send-dialog.component.css']
})
export class SendDialogComponent implements OnInit {

  Body: String = '';
  Sender: String = '';
  Receiver: String = '';
  div1: Boolean;
  div2: Boolean;
  div3: Boolean;
  msg: any;
  currentUser: any;
  username: String;
  isChild: Boolean;

  constructor(public dialogRef: MatDialogRef<SendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private messageService: MessageService, private authService: AuthService) {
      /*const self = this;
      self.currentUser = this.authService.getUser();
      self.username = self.currentUser.username;
      self.isChild = self.currentUser.isChild;*/
     }

  onNoClick(): void {
      this.dialogRef.close();
  }

  ngOnInit() {
  }

  send(): void {
    if (this.Receiver === '') {
      this.div1 = true;
      this.div2 = false;
      this.div3 = false;
    }
    else {
      if (this.Body === '') {
        this.div2 = true;
        this.div1 = false;
        this.div3 = false;
      }

      else {
        const self = this;
        this.msg = {'body': this.Body, 'recipient': this.Receiver, 'sender': this.Sender};
        this.messageService.send(this.msg)
         .subscribe(function() {
          self.div3 = true;
          this.dialogRef.close();
         });
        }
      }

    }
}
