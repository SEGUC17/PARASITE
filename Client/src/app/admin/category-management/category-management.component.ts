import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent {
  constructor(private adminservice: AdminService) { }

}
