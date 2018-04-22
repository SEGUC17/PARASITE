import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { Category } from '../../../content/category';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private adminService: AdminService, private toasterService: ToastrService) { }

  ngOnInit() {
  }

  createCategory() {
    const self = this;
    this.adminService.createCategory(this.category).subscribe(function (res) {
      if (!res) {
        return;
      }
      self.toasterService.success('The category ' + res.data.name +
        ' was created successfully', 'success');
    });
  }
}
