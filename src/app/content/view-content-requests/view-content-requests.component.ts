import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ContentRequest } from '../contentRequest';
import { Router } from '@angular/router';
import { ContentRoutingModule } from '../content-routing.module';
import { AuthService } from '../../auth/auth.service';
import { SafeResourceUrlPipe } from '../safe-resource-url.pipe';
import { MessageService } from '../../messaging/messaging.service';
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.scss']
})
export class ViewContentRequestsComponent implements OnInit {

  reqs: ContentRequest[];
  res: boolean;
  idea: boolean;
  create: boolean;
  edit: boolean;

  constructor(private _adminService: AdminService, private router: Router, private _authService: AuthService,
    private _messageService: MessageService) {
  }

  ngOnInit() {
    let self = this;
    self.viewPendingContReqs();
  }
  refreshCBs() {
    let self = this;
    let CBRes = <HTMLInputElement>document.getElementById('realtime');
    let CBIdea = <HTMLInputElement>document.getElementById('CBIdea');
    let CBCreate = <HTMLInputElement>document.getElementById('CBCreate');
    let CBEdit = <HTMLInputElement>document.getElementById('CBEdit');
    self.res = CBRes.checked;
    self.idea = CBIdea.checked;
    self.create = CBCreate.checked;
    self.edit = CBEdit.checked;
    self.viewPendingContReqs();
  }
  viewCont(contID) {
    let self = this;
    self.router.navigate(['/content-view/' + contID]);
  }

  viewPendingContReqs(): void {
    let self = this;
    self._adminService.viewPendingContReqs(self.res, self.idea, self.create, self.edit).subscribe(function (res) {
      self.reqs = res.data;
      console.log(res.data);
      console.log(res.msg);
    });
  }
  approveContentRequest(Rid, Cid, username): any {
    let self = this;
    let wantedCols: string[] = ['contributionScore'];
    self._authService.getAnotherUserData(wantedCols, username).subscribe(function (res) {
      self._adminService.respondContentRequest('approved', Rid, Cid, true, username, res.data.contributionScore).subscribe(function (res1) {
        self.viewPendingContReqs();
      });
    });
  }
  disapproveContentRequest(Rid, Cid, update, creator): any {
    let self = this;
    let isUpdate: boolean;
    let body = 'Your request to update your content has been disapproved, make sure there is nothing inappropriate,' +
      ' out of scope or irrelevant to your topic and update it again. Go to content list then my contributions to reach your document';
    if (update === 'update') {
      isUpdate = true;
    }
    self._adminService.respondContentRequest('disapproved', Rid, Cid, false, 'NotNeededHere', 0).subscribe(function (res1) {
      self.viewPendingContReqs();
      self._authService.getUserData(['username']).subscribe(function (res) {
        console.log(res.data.username);
        let msg = { 'body': body, 'recipient': creator, 'sender': res.data.username };
        if (isUpdate) {
          console.log('sending message now');
          self._messageService.send(msg).subscribe(function(res2) {
            console.log(res2.msg);
          });
        }
      });
    });
}

  getcontent(): any {
    let self = this;
    self._adminService.getcontent().subscribe(
      function (res) {
      });
  }
}
