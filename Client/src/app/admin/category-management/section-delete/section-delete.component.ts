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
      if (!res || Array.isArray(res)) {
        return;
      }
      self.toasterService.success(res.msg, 'success');
    });
  }

}
