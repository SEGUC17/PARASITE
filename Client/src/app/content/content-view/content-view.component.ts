import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.css']
})
export class ContentViewComponent implements OnInit {
  // the content that the user is viewing
  content: Content;

  // inject the needed services
  constructor(private contentService: ContentService, private route: ActivatedRoute,
    private adminService: AdminService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const self = this;
    // retrieve the id of the content from the current path and request content
    this.route.params.subscribe(function (params) {
      console.log('Object Requested with Id: ' + params.id);
      self.getContentById(params.id);
    });
  }

  // retrieve the content from the server
  getContentById(id: any): void {
    const self = this;
    this.contentService.getContentById(id).subscribe(function (retrievedContent) {
      self.content = retrievedContent.data;
      console.log('Retrieved: ' + retrievedContent.data);
    });
  }

  // admin is done with reviewing the content, send him back to his page
  returnToContentRequests(): void {
    this.router.navigate(['admin/ContentRequests']);
  }
}
