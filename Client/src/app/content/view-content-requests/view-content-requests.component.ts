import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ContentRequest } from '../contentRequest';
import { Router} from '@angular/router';
import { ContentRoutingModule } from '../content-routing.module';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.css']
})
export class ViewContentRequestsComponent implements OnInit {

  reqs: ContentRequest;
  type: String;

  constructor(private _adminService: AdminService, private router: Router, private _authService: AuthService ) {
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
    self.router.navigate(['/content-view/' + contID ]);
  }

  viewPendingContReqs(): void {
    let self = this;
    self._adminService.viewPendingContReqs(self.type).subscribe(function(res) {
    self.reqs = res.data;
    console.log(res.data);
    console.log(res.msg);
     });
  }
  approveContentRequest(Rid): any {
    let self = this;
   self._adminService.respondContentRequest('approved', Rid ).subscribe(function(res) {
     self.viewPendingContReqs();
      self.modifyContentStatus( true, res.data.contentID );
   });
  }
  disapproveContentRequest(Rid): any {
    let self = this;
    self._adminService.respondContentRequest('disapproved', Rid).subscribe(function(res) {
      self.viewPendingContReqs();
      self.modifyContentStatus( false, res.data.contentID);
    });
}
  modifyContentStatus(response: boolean, id): any {
    let self = this;
    this._adminService.modifyContentStatus( response, id).subscribe(
      function(res1) {
        if (response === true ) {
         console.log('should be after approved only , res1.creator is: ' + res1.data.creator);
          // self.addContributionPts(/*res1.data.creator*/ 'salma');
       }
});
}
  getcontent(): any {
    let self = this;
    self._adminService.getcontent().subscribe(
      function(res) {
      });
  }
  // TO-DO ContributionPts
  // getOldContPts(username): any {
  //   let self = this;
  //   let wantedCols: string[] = ['contributionScore'];

  //   self._authService.getAnotherUserData(wantedCols, username).subscribe();
  // }

  // addContributionPts(username): any {
  //   let self = this;
  //   console.log('I\'m in addContributionPts with username: ' + username);
  //   // console.log('Outcome of the auth servive, oldPoints is: ' + self.getOldContPts(username));
  //   self._adminService.addContPts(username).subscribe(
  //     function(res) {
  //       console.log('final contPts' + res.contibutionPoints);
  //     }
  //   );
  // }
}
