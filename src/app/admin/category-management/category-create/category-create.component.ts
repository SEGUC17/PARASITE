import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Category } from '../../../../interfaces/category';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {
  category: any = {
    category: '',
    iconLink: ''
  };
  @Input() inputCategories: Category[];
  categories: Category[];
  constructor(
    private adminService: AdminService,
    private toasterService: ToastrService,
    public translate: TranslateService) { }

  ngOnInit() {
    this.categories = this.inputCategories;
  }

  createCategory() {
    const self = this;
    this.adminService.createCategory(this.category).subscribe(function (res) {
      if (!res) {
        return;
      }
      self.categories.push(res.data);
      self.toasterService.success('The category ' + res.data.name +
        ' was created successfully', 'success');
    });
  }
}
