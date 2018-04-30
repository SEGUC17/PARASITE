import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'app-view-reports',
    templateUrl: './view-reports.component.html',
    styleUrls: ['./view-reports.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class ViewReportsComponent implements OnInit {

    reports: any[];
    report: any;
    reportedPerson: any;
    banResponse: any;
    reportedAt: Date;
    msg: any;
    bannedUser: string;

    constructor(private _adminService: AdminService,
        private _authService: AuthService,
        private toaster: ToastrService,
        private router: Router) {
        this.getReports();

    }

    ngOnInit() {
    }

    getReports() {
        this._adminService.getReports().subscribe((res) => {

            this.reports = res.data;
            // Getting all the reports from the array of reports and printing the reports
        });
    }

    deleteReport(report) {
        this.reports = this.reports.filter(rep => rep._id !== report._id);
        this._adminService.deleteReport(report).subscribe();
    }

    deleteReportPopUp(report) {
        swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user report',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            closeOnConfirm: false,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                this.deleteReport(report);
                swal('Deleted!', 'Report has been deleted.', 'success');
            } else {
                swal('Cancelled', 'Report is safe :)', 'error');
            }
        });

    }

    banUser(username) {
        let that = this;
        this._adminService.banUser(username).subscribe();
    }

    banUserPopUp(username) {
        if ((<HTMLInputElement>document.getElementById('bannedUsername')).value) {

            this._authService.getAnotherUserData(['_id'], username).subscribe((resp) => {
                if (resp.data._id) {
                    this.banResponse = true;
                } else {
                    this.banResponse = false;
                }
                swal({
                    title: 'Are you sure?',
                    text: 'You will not be able to undo this action',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel',
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, (isConfirm) => {
                    if (isConfirm) {
                        this.banUser(username);
                        if (this.banResponse === true) {
                            swal('Banned!', 'User has been banned.', 'success');
                            document.getElementById('bannedUsername').innerText = '';
                        } else {
                            swal('Cancelled', 'User not found', 'error');
                        }
                    } else {
                        swal('Cancelled', 'User is safe :)', 'error');
                    }
                });
            });
        } else {
            this.toaster.error('Please enter a username');
        }
    }

}

