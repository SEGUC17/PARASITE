import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ContentRequest } from '../contentRequest';
import { Router } from '@angular/router';
import { ContentRoutingModule } from '../content-routing.module';
import { AuthService } from '../../auth/auth.service';
import { SafeResourceUrlPipe } from '../safe-resource-url.pipe';
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.css']
})
export class ViewContentRequestsComponent implements OnInit {

  reqs: ContentRequest[];
  unique: String[];
  type: String;

  constructor(private _adminService: AdminService, private router: Router, private _authService: AuthService) {
  }

  ngOnInit() {

  }
  setFilterToResource() {
    let self = this;
    self.type = 'resource';
    self.viewPendingContReqs();

  }
  setFilterToIdea() {
    let self = this;
    self.type = 'idea';
    self.viewPendingContReqs();
  }
  viewCont(contID) {
    let self = this;
    self.router.navigate(['/content-view/' + contID]);
  }

  viewPendingContReqs(): void {
    let self = this;
    self._adminService.viewPendingContReqs(self.type).subscribe(function (res) {
      self.reqs = res.data;
      console.log(res.data);
      console.log(res.msg);
      // self.group();
    });
  }
  // group(): void {
  //   let self = this;
  //   let i: number;
  //   let j: number;
  //   let found: boolean;
  //   found = false;
  //   self.unique = [];
  //   for (i = 0; i < self.reqs.length; i++) {
  //     for (j = 0; j < self.unique.length; j++) {
  //       console.log('[' + i + '][' + j + ']');
  //       console.log(self.unique[j]);
  //       console.log(self.reqs[i].creator);

  //       if (self.unique[j] === self.reqs[i].creator) {
  //         found = true;
  //       }
  //     }
  //     console.log('found is: ' + found);
  //     if (found) {
  //       console.log('gonna push now');
  //       self.unique.push(self.reqs[i].creator);
  //       console.log(self.unique);
  //       found = false;
  //     }
  //   }
  //   console.log(self.unique);
  // }
  approveContentRequest(Rid, Cid, username): any {
    let self = this;
    let wantedCols: string[] = ['contributionScore'];
    self._authService.getAnotherUserData(wantedCols, username).subscribe(function (res) {
      self._adminService.respondContentRequest('approved', Rid, Cid, true, username, res.data.contributionScore).subscribe(function (res1) {
        self.viewPendingContReqs();
      });
    });
  }
  disapproveContentRequest(Rid, Cid): any {
    let self = this;
    let wantedCols: string[] = ['contributionScore'];
    self._adminService.respondContentRequest('disapproved', Rid, Cid, false, 'NotNeededHere', 0).subscribe(function (res1) {
      self.viewPendingContReqs();
    });
  }

  getcontent(): any {
    let self = this;
    self._adminService.getcontent().subscribe(
      function (res) {
      });
  }
}
