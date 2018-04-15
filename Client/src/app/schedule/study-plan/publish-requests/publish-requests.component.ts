import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-publish-requests',
  templateUrl: './publish-requests.component.html',
  styleUrls: ['./publish-requests.component..scss']
})
export class PublishRequestsComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }
  ngOnInit() {
  }
  viewStudyPlanPublishReqs(): void {
    let self = this;
    self.adminService.viewStudyPlanPublishReqs().subscribe(function(res) {
     });
  }
  approveStudyPlanPublishReqs(id, sid): void {
    let self = this;
    self.adminService.respondStudyPlanPublishReqs('approved', id, sid).subscribe(function(res) {
     });
  }

  disapproveStudyPlanPublishReqs(id, sid): void {
    let self = this;
    self.adminService.respondStudyPlanPublishReqs('disapproved', id, sid).subscribe(function(res) {
     });
  }

}
