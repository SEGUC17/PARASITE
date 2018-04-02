import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
  providers: [MessageService]
})
export class MessagingComponent implements OnInit {

  Body: String = '';
  Sender: String = '';
  Receiver: String = '';
  User: AuthService;
  // user: any = this.User.getUser();
  msg: any;
  div1: Boolean;
  div2: Boolean;
  inbox: any[];
  sent: any[];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.getInbox();
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

    getSent(): void {
      const self = this;
      this.messageService.getSent('sarah').subscribe(function(msgs) {
        self.sent = msgs.data;
       });
    }
}
