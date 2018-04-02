import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ContentRequest } from '../contentRequest';
import { Router} from '@angular/router';
import { ContentRoutingModule } from '../content-routing.module';
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.css']
})
export class ViewContentRequestsComponent implements OnInit {

  reqs: ContentRequest;
  type: String;

  constructor(private _adminService: AdminService, private router: Router ) {
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
    console.log('this is content ID: ' + contID);
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
      console.log('this is the contentid' + res.data.contentID);
      console.log(res.data);
      console.log(res.msg);
      self.viewPendingContReqs();
      self.modifyContentStatus( true, res.data.contentID);
    });
  }
  disapproveContentRequest(Rid): any {
    let self = this;
    self._adminService.respondContentRequest('disapproved', Rid).subscribe(function(res) {
      console.log('this is the contentid' + res.data.contentID.toString());
      console.log(res.data);
      console.log(res.msg);
      self.viewPendingContReqs();
      self.modifyContentStatus( false, res.data.contentID);
    });
}
  modifyContentStatus(response: boolean, id): any {
    console.log('in component this is id: ' + id );
    let self = this;
    this._adminService.modifyContentStatus( response, id).subscribe(
      function(res1) {
      console.log(res1.data);
      console.log(res1.msg);
});
}
  getcontent(): any {
    let self = this;
    self._adminService.getcontent().subscribe(
      function(res) {
        console.log(res.data);
      });
  }
}
