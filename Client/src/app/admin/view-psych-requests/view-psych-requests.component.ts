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

    let self = this;
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and psychologist added to database.') {
        self.requests = self.removeElement(self.requests, index);
      }
    });
  }

  rejectReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = false;

    let self = this;
    this.service.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and applicant notified.') {
        self.requests = self.removeElement(self.requests, index);
      }
    });
  }

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
