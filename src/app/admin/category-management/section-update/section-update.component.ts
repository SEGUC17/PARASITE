import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { Section } from '../../../../interfaces/section';
import { AdminService } from '../../admin.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(
    private adminService: AdminService,
    private toasterService: ToastrService,
    public translate: TranslateService
  ) { }

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
