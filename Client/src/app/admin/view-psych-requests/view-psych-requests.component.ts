import { Component, OnInit } from '@angular/core';
import { PsychRequestsService } from './psych-requests.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-psych-requests',
  templateUrl: './view-psych-requests.component.html',
  styleUrls: ['./view-psych-requests.component.css']
})
export class ViewPsychRequestsComponent implements OnInit {

  requests: any[];

  mockPsychs = [{
    firstName: 'Ahmed',
    lastName: 'Darwish',
    phone: '01128766886',
    address: '12 Helton Str, Cairo, Egypt',
    email: 'MotherFucker@bitch.ass',
    daysOff: ['Saturday', 'Sunday'],
    priceRange: 550
  }, {
    firstName: 'Ahmed',
    lastName: 'Darwish',
    phone: '01128766886',
    address: '12 Helton Str, Cairo, Egypt',
    email: 'MotherFucker@bitch.ass',
    daysOff: ['Saturday', 'Sunday'],
    priceRange: 550
  }];

  constructor(private service: PsychRequestsService) {
    let self = this;
    this.service.getPsychRequests().subscribe(function (res) {
      if (res.msg === 'Requests retrieved successfully.') {
        self.requests = res.data;
        console.log(self.requests);
      }
    });
  }

  ngOnInit() {
  }

  acceptReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = true;
    console.log(reqToSend);
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and product added to database.') {
        let i = this.mockRequests.indexOf(this.mockRequests[index], 0);
        if (index > -1) {
          this.mockRequests.splice(i, 1);
        }
        console.log(res.data);
      }
    });
  }

  rejectReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = false;
    console.log(reqToSend);
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and user notified.') {
        let i = this.mockRequests.indexOf(this.mockRequests[index], 0);
        if (index > -1) {
          this.mockRequests.splice(i, 1);
        }
        console.log(res.data);
      }
    });
  }

}
