import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ContentService } from '../../content/content.service';
import { Category } from '../../../interfaces/category';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[];
  constructor(
    private adminservice: AdminService,
    private contentService: ContentService,
    public translate: TranslateService
  ) { }
  // retrieve all categories from server
  getCategories(): void {
    const self = this;
    this.contentService.getCategories().subscribe(function (res) {
      if (!res || !res.data) {
        return [];
      }
      self.categories = res.data;
    });
  }
  ngOnInit() {
    this.getCategories();
  }

}
