import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { StudyPlanPublishRequest } from './study-plan-publish-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publish-requests',
  templateUrl: './publish-requests.component.html',
  styleUrls: ['./publish-requests.component..scss']
})
export class PublishRequestsComponent implements OnInit {
  reqs: [StudyPlanPublishRequest];

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.viewStudyPlanPublishReqs();
  }

  viewStudyPlan(id) {
    let self = this;
    // TODO: redirect to study plan
  }

  viewStudyPlanPublishReqs(): void {
    let self = this;
    self.adminService.viewStudyPlanPublishReqs().subscribe(function (res) {
      self.reqs = res.data;
    });
  }

  respondStudyPlanPublishReqs(response, id, sid): void {
    console.log(id);
    let self = this;
    self.adminService.respondStudyPlanPublishReqs(response, id, sid).subscribe(function (res) {
      self.reqs = res.data;
    });
    self.viewStudyPlanPublishReqs();
  }

}
