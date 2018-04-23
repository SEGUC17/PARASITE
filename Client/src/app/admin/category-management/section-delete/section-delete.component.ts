import { Component, OnInit, Input } from '@angular/core';
import { Section } from '../../../content/section';
import { Category } from '../../../content/category';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-section-delete',
  templateUrl: './section-delete.component.html',
  styleUrls: ['./section-delete.component.scss']
})
export class SectionDeleteComponent implements OnInit {
  @Input() inputCategories: Category[];
  categories: Category[];
  selectedCategory: Category;
  selectedSection: Section = {
    _id: '',
    name: '',
    iconLink: ''
  };
  constructor(private adminService: AdminService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.categories = this.inputCategories;
  }

  deleteSection() {
    const self = this;
    this.adminService.deleteSection(this.selectedCategory._id, this.selectedSection._id).subscribe(function (res) {
      console.log(res);
      if (!res || Array.isArray(res)) {
        return;
      }
      const updatedCategoryIndex = self.categories.findIndex(function (category) {
        return self.selectedCategory._id === category._id;
      });
      const updateSectionIndex = self.categories[updatedCategoryIndex].sections.
        findIndex(function (section) {
          return section._id === self.selectedSection._id;
        });
      self.categories[updatedCategoryIndex].sections = self.categories[updatedCategoryIndex].sections.splice(updateSectionIndex, 1);
      self.toasterService.success(res.msg, 'success');
    });
  }

}
