import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService} from '../messaging.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})



export class ContactUsComponent implements OnInit {
  constructor(private _MessageService: MessageService, private _Toastr: ToastrService ) { }

  ngOnInit() {
  }

contact_us(): void {
  console.log('entered method');
  const self = this;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const reciepient = '';
  const msg = (<HTMLInputElement> document.getElementById('msg')).value;
  const sender = (<HTMLInputElement> document.getElementById('from')).value;

  const toSend = {
    body: msg,
    recipient: '',
    sender: sender
   };
  if (msg === '') {
  self._Toastr.warning('Cannot send an empty message!');
  console.log(msg);
  } else if (sender === '') {
  self._Toastr.warning('You  need to specifiy an email');

  } else if (!(re.test(sender))) {
      self._Toastr.warning('please provide a proper email address!');
    } else {
      self._MessageService.contactus(toSend).subscribe(function(res) {
        self._Toastr.success(res.msg);
   });
  }
}
}
