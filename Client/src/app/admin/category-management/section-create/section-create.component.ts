import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../content/category';
import { ToastrService } from 'ngx-toastr';
import { Section } from '../../../content/section';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-section-create',
  templateUrl: './section-create.component.html',
  styleUrls: ['./section-create.component.scss']
})
export class SectionCreateComponent implements OnInit {
  @Input() inputCategories: Category[];
  categories: Category[];
  constructor(private toasterService: ToastrService, private adminService: AdminService) { }
  selectedCategory: Category;
  selectedSection = {
    section: '',
    iconLink: ''
  };
  ngOnInit() {
    this.categories = this.inputCategories;
  }
  createSection() {
    const self = this;
    this.adminService.createSection(this.selectedCategory._id, this.selectedSection).subscribe(function (res) {
      if (!res) {
        return;
      }
      console.log(res);
      if (!res.msg) {
        self.toasterService.error(res.err, 'failure');
        return;
      }
      const updateIndex = self.categories.findIndex(function (category) {
        return category._id === self.selectedCategory._id;
      });
      self.categories[updateIndex] = res.data;
      self.toasterService.success(res.msg, 'success');
    });
  }

}
