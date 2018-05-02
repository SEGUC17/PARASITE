import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { ImageUploaderComponent } from '../../image-uploader/image-uploader.component';
import { MessageService } from '../../messaging/messaging.service';
import { AuthService } from '../../auth/auth.service';
declare const swal: any;
declare const $: any;
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-verified-contributer-requests',
  templateUrl: './view-verified-contributer-requests.component.html',
  styleUrls: ['./view-verified-contributer-requests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewVerifiedContributerRequestsComponent implements OnInit {
  /*
    @author: MAHER.
   */

  constructor(private _adminService: AdminService, private router: Router,
    private _messageService: MessageService, private _authService: AuthService) { }


  Requests: any[] = [];
  filter: String = 'pending';


  ngOnInit() {
    this.viewVCRs('pending');
  }

  pendingRadio() { // triggered by Radio button to change the filter
    this.filter = 'pending';
    this.viewVCRs(this.filter);
  }

  acceptedRadio() { // triggered by Radio button to change the filter
    console.log('accept');
    this.filter = 'approved';
    this.viewVCRs(this.filter);
  }

  rejectedRadio() { // triggered by Radio button to change the filter
    this.filter = 'disapproved';
    this.viewVCRs(this.filter);

  }


  viewVCRs(FilteredBy) {  // request the Verified Contributer Requests from the server to this.Requests.
    let self = this;

    this._adminService.viewPendingVCR(FilteredBy).subscribe(function (res) {
      self.Requests = res.data.dataField;
      if (res.msg === 'VCRs retrieved successfully.') {
        console.log(res.data.dataField);
        console.log('loaded response.data');
      } else {
        console.log('failed');
      }
    });
  }

  onNameClick(request) {  // redirect the Admin to the user's page.
    console.log('clicked');
    this.router.navigate(['/profile/' + request.creator]);
  }

  Accept(request) { // Accepted by Admin.
    this._adminService.respondToContributerValidationRequest(request._id, 'approved');

  }

  Reject(request) { // rejected by Admin.
    console.log(request);
    const self = this;
    this._adminService.respondToContributerValidationRequest(request._id, 'disapproved').subscribe(function (res) {
      self.viewVCRs(self.filter);
      self._authService.getUserData(['username']).subscribe(function (res) {
        self.showPromptMessage(request.creator, res.data.username);
      });
    });
  }
  // not testedd
  showPromptMessage(creator, sender): any {
    // creator is the Activity creator
    // sender in the currently logged in admin
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
