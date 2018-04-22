import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../content/content.service';
import { Category } from '../../../content/category';
import { AdminService } from '../../../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {
  categories: Category[];
  selectedCategory: Category = {
    _id: '',
    name: '',
    iconLink: '',
    sections: []
  };
  constructor(private contentService: ContentService, private adminService: AdminService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.getCategories();
  }
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
  updateCategory() {
    const self = this;
    this.adminService.updateCategory(self.selectedCategory).subscribe(function (res) {
      if (!res) {
        return;
      }
      self.toasterService.success('update category successfully', 'success');
    });
  }

}
