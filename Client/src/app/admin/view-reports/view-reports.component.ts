import { Component, OnInit } from '@angular/core';
// import { ReportsService } from './viewReports.service';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
    selector: 'app-view-reports',
    templateUrl: './view-reports.component.html',
    styleUrls: ['./view-reports.component.scss']
  })


export class ViewReportsComponent implements OnInit {

    reports : any [];
    reportedPerson : any;
    reporter : any;
    reportedAt : Date;
    reason : any;

    constructor(private _adminService: AdminService,
        private router: Router){

        this._adminService.getReports().subscribe(function (res) {
                this.reporter=res.reporter;
                this.reportedPerson=res.reportedPerson;
                this.reportedAt=res.reportedAt;
                this.reason=res.reason;

        });
    }
    
    
    
    ngOnInit() {    
    }

}

