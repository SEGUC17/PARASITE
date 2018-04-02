import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
  providers: [MessageService, AuthService]
})

export class MessagingComponent implements OnInit {

  Body: String = '';
  Sender: String = '';
  Receiver: String = '';
  currentUser: any;
  username: String;
  isChild: Boolean;
  msg: any;
  div1: Boolean;
  div2: Boolean;
  div3: Boolean;
  div4: Boolean;
  inbox: any[];
  sent: any[];
  x: Boolean = false;

  constructor(private messageService: MessageService, private authService: AuthService) {
    const self = this;
    self.currentUser = this.authService.getUser();
    /*this.authService.getUser().subscribe(function(user) {
      self.currentUser = user.data;
     });*/
     // self.username = self.currentUser.username;
     // self.isChild = self.authService.isChild;
   }

  ngOnInit() {
    if (this.x) {
      this.div3 = true;
    }

    else {
      this.div3 = false;
      this.getInbox();
    }
  }

  send(): void {
    if (this.Receiver === '') {
      this.div1 = true;
    }

    if (this.Body === '') {
      this.div2 = true;
    }

    else {
      this.msg = {'body': this.Body, 'recipient': this.Receiver, 'sender': this.Sender};
      this.messageService.send(this.msg)
       .subscribe(res => console.log(res));
      }
    }

    getInbox(): void {
      const self = this;
      this.messageService.getInbox('sarah').subscribe(function(msgs) {
        self.inbox = msgs.data;
       });
    }

   /*deleteMessage(event): void {
     this.messageService.deleteMessage(event.data._id).subscribe(function(res) {
      event.confirm.resolve();
    });
    console.log('DELETED!');
   }*/

    getSent(): void {
      const self = this;
      this.messageService.getSent('sarah').subscribe(function(msgs) {
        self.sent = msgs.data;
        self.div4 = true;
       });
    }
}
