import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../messaging/messaging.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})



export class ContactUsComponent implements OnInit {
  public msg: any = {
    body: '',
    recipient: '',
    sender: ''
  };
  response: any;


  // ---flags -- //
  user;
  visitor;


  constructor(private _MessageService: MessageService,
    private _Toastr: ToastrService,
    private _AuthService: AuthService, public translate: TranslateService) {

    const self = this;
    const userDataColumns = ['username'];
    this._AuthService.getUserData(userDataColumns).subscribe(function (response) {
      self.user = true;
      self.msg.sender = response.data.username;
    }, function (error) {
      if (error.status === 401) {
        self.visitor = true;
      }
    });
  }



  ngOnInit() {
  }
  contact_us() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const self = this;
    if (self.msg.body === '') {
      self._Toastr.warning('Cannot send an empty message');
    } else if (self.visitor === true && (!(re.test(self.msg.sender)))) {
      self._Toastr.warning('You need to provide an email!');
    } else {
      this._MessageService.contactus(self.msg).subscribe(function (res) {
        self._Toastr.success(res.msg);
      });
    }
  }

}

