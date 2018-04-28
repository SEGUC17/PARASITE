import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
    selector: 'app-view-reports',
    templateUrl: './view-reports.component.html',
    styleUrls: ['./view-reports.component.scss']
})


export class ViewReportsComponent implements OnInit {

    reports: any[];
    report: any;
    reportedPerson: any;
    reporter: any;
    reportedAt: Date;
    reason: any;

    constructor(private _adminService: AdminService,
        private router: Router) {


    }

    ngOnInit() {
        this._adminService.getReports().subscribe(function (res) {

            this.reports = res.data;
            // Getting all the reports from the array of reports and printing the reoprts
            for (let i = 0; i < this.reports.length; i += 1) {
                this.report = this.reports[i];
                console.log('The reporter : ' + this.report.reporter);
                console.log('The reported user: ' + this.report.reportedPerson);
                console.log(this.report.reportedAt);
                console.log('reason: ' + this.report.reason);
            }
        });
    }

}

