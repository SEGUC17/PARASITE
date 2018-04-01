import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.css']
})
export class ContentViewComponent implements OnInit {
  content: Content;
  constructor(private contentService: ContentService, private route: ActivatedRoute, private adminService: AdminService) { }

  ngOnInit() {
    const self = this;
    this.route.params.subscribe(function (params) {
      console.log('Object Requested with Id: ' + params.id);
      self.getContentById(params.id);
    });
  }

  getContentById(id: any): void {
    const self = this;
    this.contentService.getContentById(id).subscribe(function (retrievedContent) {
      self.content = retrievedContent.data;
      console.log('Retrieved: ' + retrievedContent.data);
    });
  }

  respondContentRequest(response: String): void {
    const self = this;
    this.adminService.
    respondContentRequest(response, self.content._id).
    subscribe();
  }

}
