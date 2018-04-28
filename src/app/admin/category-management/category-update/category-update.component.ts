import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../../content/content.service';
import { AdminService } from '../../admin.service';
import { Category } from '../../../../interfaces/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {
  categories: Category[];
  @Input() inputCategories: Category[];
  selectedCategory: Category = {
    _id: '',
    name: '',
    iconLink: '',
    sections: []
  };
  constructor(
    private contentService: ContentService,
    private adminService: AdminService,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    this.categories = this.inputCategories;
  }
  updateCategory() {
    const self = this;
    this.adminService.updateCategory(self.selectedCategory).subscribe(function (res) {
      if (!res) {
        return;
      }
      const updateIndex = self.categories.findIndex(function (category) {
        return category._id === self.selectedCategory._id;
      });
      self.categories[updateIndex] = self.selectedCategory;
      self.toasterService.success(res.msg, 'success');
    });
  }

}
