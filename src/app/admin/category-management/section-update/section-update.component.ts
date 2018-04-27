import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../content/category';
import { Section } from '../../../content/section';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-section-update',
  templateUrl: './section-update.component.html',
  styleUrls: ['./section-update.component.scss']
})
export class SectionUpdateComponent implements OnInit {
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
  updateSection() {
    const self = this;
    this.adminService.updateSection(this.selectedCategory._id, this.selectedSection).subscribe(function (res) {
      if (!res) {
        return;
      }
      self.toasterService.success(res.msg, 'success');
    });
  }

}
