import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';

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
  msg: any;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  send(): void {
    const self = this;
    this.msg = {'body': this.Body, 'recipient': this.Receiver, 'sender': this.Sender};
    this.messageService.send(this.msg)
      .subscribe(res => console.log(res));
  }
  
  deleteMessage(event) :void {
    this.messageService.deleteMessage(event.data._id).subscribe(function(res){
      event.confirm.resolve();
    });
    console.log("DELETED!");
  }

}
