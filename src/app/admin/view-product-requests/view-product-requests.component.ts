import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductRequestsService } from './product-requests.service';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../../messaging/messaging.service';
declare const swal: any;
declare const $: any;
@Component({
  selector: 'app-view-product-requests',
  templateUrl: './view-product-requests.component.html',
  styleUrls: ['./view-product-requests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProductRequestsComponent implements OnInit {

  // Variables for the component
  requests: any[] = [];
  currentUser: any;

  constructor(private services: ProductRequestsService,
    private authService: AuthService,
    private router: Router,
    private _messageService: MessageService) {

    let self = this;

    // Retrieving the current user needed information
    const userDataColumns = ['username', 'isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (user) {
      if (user.msg === 'Data Retrieval Is Successful!') {

        // If retrieval is successful, set currentUser variable
        self.currentUser = user.data;

        // Check if currentUser is an admin
        if (self.currentUser.isAdmin) {
          // If yes, get the requests from the DB
          self.services.getProductRequests().subscribe(function (prodReq) {
            if (prodReq.msg === 'Requests retrieved successfully.') {
              self.requests = prodReq.data;
            }
          });
        } else {
          // Else navigate to homepage
          self.router.navigateByUrl('/newsfeed');
        }
      }
    });
  }

  ngOnInit() {
  }

  // Function for accepted requests
  acceptReq(index) {
    // Get the request, and set its evalution result to true
    let reqToSend = this.requests[index];
    reqToSend['result'] = true;

    // Send the POST request
    let self = this;
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and product added to database.') {
        // If a 200 OK is received, remove the request from the view
        let i = self.requests.indexOf(self.requests[index], 0);
        if (index > -1) {
          self.requests.splice(i, 1);
        }
      }
    });
  }

  // Function for rejected requests
  rejectReq(index) {
    // Get the request, and set its evalution result to false
    let reqToSend = this.requests[index];
    reqToSend['result'] = false;

    // Send the POST request
    let self = this;
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and user notified.') {
        // If a 200 OK is received, remove the request from the view
        let i = self.requests.indexOf(self.requests[index], 0);
        if (index > -1) {
          self.requests.splice(i, 1);
        }
        self.showPromptMessage(reqToSend.seller, self.currentUser.username);
      }
    });
  }
  showPromptMessage(creator, sender): any {
    // creator is the content creator
    //sender in the currently logged in admin
    // isUpdate : false if create
    let self = this;
    swal({
      title: 'Want to send a message to ' + creator + '?',
      text: 'Let ' + creator + ' know what\'s wrong',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'Write reason for disapproval here',
    }, function (inputValue) {
      if (inputValue === false) { return false; }
      if (inputValue === '') {
        swal.showInputError('You need to write something!'); return false;
      }
      let body = 'This is a message from an admin @ Nawwar.\n' + inputValue + '.\nDo not hesitate to contribute with us again.';
      swal('Message sent', 'Message sent is :\n' + body, 'success');
      let msg = { 'body': body, 'recipient': creator, 'sender': sender };
      self._messageService.send(msg).subscribe(function (res2) {

      });
    }
    );
  }
}
