import { Component, OnInit } from '@angular/core';
import { ProductRequestsService } from './product-requests.service';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product-requests',
  templateUrl: './view-product-requests.component.html',
  styleUrls: ['./view-product-requests.component.scss']
})
export class ViewProductRequestsComponent implements OnInit {

  // Variables for the component
  requests: any[] = [];
  currentUser: any;

  constructor(private services: ProductRequestsService,
    private authService: AuthService,
    private router: Router) {

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
          self.router.navigateByUrl('/');
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
      }
    });
  }

}
