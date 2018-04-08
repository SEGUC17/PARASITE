import { Component, OnInit } from '@angular/core';
import { PsychRequestsService } from './psych-requests.service';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-psych-requests',
  templateUrl: './view-psych-requests.component.html',
  styleUrls: ['./view-psych-requests.component.css']
})
export class ViewPsychRequestsComponent implements OnInit {

  // Variables for the component
  requests: any[];
  currentUser: any;

  constructor(private service: PsychRequestsService,
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
          self.service.getPsychRequests().subscribe(function (psychReq) {
            if (psychReq.msg === 'Requests retrieved successfully.') {
              self.requests = psychReq.data;
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
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and psychologist added to database.') {
        // If a 200 OK is received, remove the request from the view
        self.requests = self.removeElement(self.requests, index);
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
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and applicant notified.') {
        // If a 200 OK is received, remove the request from the view
        self.requests = self.removeElement(self.requests, index);
      }
    });
  }

  // A function to remove an element from an array
  removeElement(arr: any[], index: any) {
    let newArr: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (i !== index) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

}
