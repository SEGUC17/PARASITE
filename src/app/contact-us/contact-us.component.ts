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


  constructor(private Message: MessageService,
    private Toastr: ToastrService,
    private Auth: AuthService, public translate: TranslateService) {

    const self = this;
    const userDataColumns = ['username'];
    this.Auth.getUserData(userDataColumns).subscribe(function (response) {
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
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const self = this;
    if (self.msg.body === '') {

      this.translate.get('MESSAGING.TOASTR.EMPTY_MSG').subscribe(function(translation) {
        self.Toastr.warning(translation);

      });
    } else if (self.visitor === true && (!(re.test(self.msg.sender)))) {

      this.translate.get('LANDING.EMPTY_EMAIL').subscribe(function(translation) {
        self.Toastr.warning(translation);

      });
    } else {

      this.Message.contactus(self.msg).subscribe();
      this.translate.get('MESSAGING.TOASTR.MSG_SENT').subscribe(function(translation) {
        self.Toastr.success(translation);

      });
    }
  }

}

