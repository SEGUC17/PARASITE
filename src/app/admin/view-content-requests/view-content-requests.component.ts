import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../admin.service';
import { ContentRequest } from './contentRequest';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SafeResourceUrlPipe } from '../../../pipe/safe-resource-url.pipe';
import { MessageService } from '../../messaging/messaging.service';
import { TranslateService } from '@ngx-translate/core';
declare const swal: any;
declare const $: any;
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewContentRequestsComponent implements OnInit {

  reqs: ContentRequest[];
  res: boolean;
  idea: boolean;
  create: boolean;
  edit: boolean;


  constructor(
    private _adminService: AdminService,
    private router: Router,
    private _authService: AuthService,
    private _messageService: MessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    let self = this;
    self.viewPendingContReqs();
  }
  refreshCBs() {
    let self = this;
    let CBRes = <HTMLInputElement>document.getElementById('CBRes');
    let CBIdea = <HTMLInputElement>document.getElementById('CBIdea');
    self.res = CBRes.checked;
    self.idea = CBIdea.checked;
    let CBCreate = <HTMLInputElement>document.getElementById('CBCreate');
    let CBEdit = <HTMLInputElement>document.getElementById('CBEdit');
    if (CBCreate || CBEdit) {
      self.create = CBCreate.checked;
      self.edit = CBEdit.checked;
    } else {
      self.edit = false;
      self.create = false;
    }
    self.viewPendingContReqs();
  }

  viewPendingContReqs(): void {
    let self = this;
    self._adminService.viewPendingContReqs(self.res, self.idea, self.create, self.edit).subscribe(function (res) {
      self.reqs = res.data;
    });
  }
  approveContentRequest(Rid, Cid, username): any {
    let self = this;
    let wantedCols: string[] = ['contributionScore'];
    self._authService.getAnotherUserData(wantedCols, username).subscribe(function (res) {
      console.log('old contribution score is ' + res.data.contributionScore);
      self._adminService.respondContentRequest('approved', Rid, Cid, true, res.data.contributionScore).subscribe(function (res1) {
        self.viewPendingContReqs();
      });
    });
  }
  disapproveContentRequest(Rid, Cid, update, creator): any {
    let self = this;
    let isUpdate: boolean;
    if (update === 'update') {
      isUpdate = true;
    }
    self._adminService.respondContentRequest('disapproved', Rid, Cid, false, 0).subscribe(function (res1) {
      self.viewPendingContReqs();
      self._authService.getUserData(['username']).subscribe(function (res) {
        self.showPromptMessage(creator, res.data.username, isUpdate);
      });
    });
  }
  getcontent(): any {
    let self = this;
    self._adminService.getcontent().subscribe(
      function (res) {
      });
  }
  showPromptMessage(creator, sender, isUpdate): any {
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
      if (isUpdate) {
        body = body + '\nYou can reach your content by going to the tab content-list then my contributions and update your content again.';
      }
      swal('Message sent', 'Message sent is :\n' + body, 'success');
      let msg = { 'body': body, 'recipient': creator, 'sender': sender };
      self._messageService.send(msg).subscribe(function (res2) {

      });
    }
    );
  }
}
