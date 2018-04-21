import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  options = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  constructor(private adminservice: AdminService) { }
  Categoryname: String = '';
  Sectionname: String = '';
  Category: any ;
  AllisWell: Boolean = true;

  ngOnInit() {
  }
  deleteSection() : void {
    if (this.AllisWell){
    this.Category = {'Categoryname': this.Categoryname , 'sectionname': this.Sectionname
  } };
  const self = this ;
  self.adminservice.deleteSection(this.Category , this.Sectionname).subscribe();

  }

  deleteCategory() : void {
    if (this.AllisWell){
    this.Category = {'Categoryname': this.Categoryname 
  } };
  const self = this ;
  self.adminservice.deleteCategory(this.Category).subscribe();
  }
}