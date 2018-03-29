import { Component, OnInit } from '@angular/core';
import { MessageService } from '../messaging.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /*send(message: any): void {
    var self = this;
    this.messageService.send(message)
      .subscribe(res => console.log(res.json()));
  }*/

}
