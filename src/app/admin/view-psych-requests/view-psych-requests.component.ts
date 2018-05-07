import { Component, OnInit } from '@angular/core';
import { PsychRequestsService } from './psych-requests.service';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { PsychologistRequest } from '../../psychologist/PsychologistRequest';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-psych-requests',
  templateUrl: './view-psych-requests.component.html',
  styleUrls: ['./view-psych-requests.component.scss']
})
export class ViewPsychRequestsComponent implements OnInit {

  // Variables for the component
  requests: PsychologistRequest[];
  editRequests: PsychologistRequest[];
  addRequests: PsychologistRequest[];
  state: String;
  currentUser: any;

  constructor(private service: PsychRequestsService,
    private authService: AuthService,
    private router: Router,
    private toasterService: ToastrService) {

    let self = this;
    self.state = 'add';

    // Retrieving the current user needed information
    const userDataColumns = ['username', 'isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (user) {
      if (user.msg === 'Data Retrieval Is Successful!') {

        // If retrieval is successful, set currentUser variable
        self.currentUser = user.data;

        // Check if currentUser is an admin
        if (self.currentUser.isAdmin) {
          // If yes, get the requests from the DB
          self.getRequests();
        } else {
          // Else navigate to homepage
          self.router.navigateByUrl('/newsfeed');
        }
      }
    });
  }

  private getRequests(): void {
    const self = this;
    this.service.getPsychRequests().subscribe(function (psychReq) {
      if (psychReq.msg === 'Requests retrieved successfully.') {
        self.filter(psychReq.data);
        self.loadRequests(self.state);
      }
    });
  }

  filter(reqs: any[]): void {
    this.addRequests = [];
    this.editRequests = [];
    for (let i = 0, j = 0, h = 0; i < reqs.length; i++) {
      if (reqs[i].type === 'add') {
        this.addRequests[j++] = reqs[i];
      } else if (reqs[i].type === 'edit') {
        this.editRequests[h++] = reqs[i];
      }
    }
  }

  loadRequests(status: String): void {
    let self = this;
    if (status === 'add') {
      self.state = 'add';
      let temp = self.addRequests;
      self.requests = temp;
    } else {
      self.state = 'edit';
      let temp = self.editRequests;
      self.requests = temp;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  // Function for accepted requests
  acceptReq(index) {
    // Get the request, and set its evalution result to true
    let reqToSend = this.requests[index];
    reqToSend['result'] = true;

    // Send the POST request
    let self = this;
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.err === null) {
        // If a 200 OK is received, remove the request from the view
        self.requests = self.removeElement(self.requests, index);
        self.toasterService.success(res.msg, 'success');
      } else {
        self.toasterService.error('Request was not found.', 'failure');
        self.getRequests();
        self.loadRequests(self.state);
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
      if (res.err === null) {
        // If a 200 OK is received, remove the request from the view
        self.requests = self.removeElement(self.requests, index);
        self.toasterService.success(res.msg, 'success');
      } else {
        self.toasterService.error('Request was not found.', 'failure');
        self.getRequests();
        self.loadRequests(self.state);
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
