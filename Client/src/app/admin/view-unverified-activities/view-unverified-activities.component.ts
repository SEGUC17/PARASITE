import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-view-unverified-activities',
  templateUrl: './view-unverified-activities.component.html',
  styleUrls: ['./view-unverified-activities.component.css']
})
export class ViewUnverifiedActivitiesComponent implements OnInit {

  constructor(private _adminService: AdminService) { }

  ngOnInit() {
  }

  acceptActivity():void{

  }

  rejectActivity():void{
    
  }

}
