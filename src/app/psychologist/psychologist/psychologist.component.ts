
/* tslint-disable max-len */
/* tslint-disable max-statements */

import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef  } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AddPsychRequestComponent } from '../add-psych-request/add-psych-request.component';
import { EditPsychComponent } from '../edit-psych/edit-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Psychologist } from '../psychologist/psychologist';
import { ToastrService } from 'ngx-toastr';
declare const swal: any;

@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PsychologistComponent implements OnInit {

  psychologists: any[];
  admin: boolean;
  idInput = new FormControl();
  psychologist: Psychologist;
  entriesPerPage = 25;
  pageNumber: number;
  sorts = [
    'cheapest',
    'a-z'
  ];
  sort: string;
  writtenSearch: string;
  selectedSearch: string;
  writtenAddress: string;
  selectedAddress: string;

  constructor(private psychologistService: PsychologistService,
    private toasterService: ToastrService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog) { }
  formInput = <any>{};

  // load psychologists from the db
  getPsychologists(): void {
    let self = this;
    self.psychologists = [];
    self.pageNumber = 1;
    self.getPage();
  }
  getPage(): void {
    let self = this;
    let limiters = {
      entriesPerPage: self.entriesPerPage,
      pageNumber: self.pageNumber,
      sort: self.sort,
      search: self.selectedSearch,
      address: self.selectedAddress
    };
    self.psychologistService.getPsychologists(JSON.stringify(limiters)).subscribe(function (psychs) {
      self.psychologists = self.psychologists.concat(psychs.data.docs);
    });
  }

  // open the request form for adding a new psychologist
  addRequestForm(): void {
    const self = this;
    let dialogOpener = this.dialog.open(AddPsychRequestComponent, {
      width: '60%',
      height: '90%'
    });

    dialogOpener.afterClosed().subscribe(result => {
      self.getPsychologists();
    });
  }


  // show a pop-up for non-Admin users to enter his ID when attempting to edit some information
  showEditPrompt(i): void {
    const self = this;

    if (this.admin) {
      // in case of an admin editing..edit directly without request the ID
      self.getPsychologistData(self.psychologists[i]._id);
    } else {
      // for normal users show swal with input field to enter ID
      swal({
          title: 'Are you sure this is you!',
          text: 'If you want to edit this information please enter your ID here',
          type: 'input',
          showCancelButton: true,
          closeOnConfirm: false,
          animation: 'slide-from-top',
          inputPlaceholder: 'Request ID..'
      }, function (inputValue) {
          if (inputValue === false) { return false; }
          if (!(inputValue === self.psychologists[i]._id)) {
            // user entered incorrect ID
              swal.showInputError('The Id you entered does\'t match with this information, try again'); return false;
          }
          // ID is correct close alert and retrive the data he's requesting to edit
          swal.close();
          self.getPsychologistData(inputValue);
      });
    }
  }

  // show a pop-up for non-Admin users to enter his ID when attempting to delete some information
  showDeletePrompt(i): void {
    const self = this;
    if (this.admin) {
      // in case of an admin editing..delete directly without request the ID
      self.deletePsychologist(i);
    } else {
      // for normal users show swal with input field to enter ID
      swal({
          title: 'Are you sure this is you!',
          text: 'If you want to delete this information please enter your ID here',
          type: 'input',
          showCancelButton: true,
          closeOnConfirm: false,
          animation: 'slide-from-top',
          inputPlaceholder: 'Request ID..'
        }, function (inputValue) {
            if (inputValue === false) { return false; }
            if (!(inputValue === self.psychologists[i]._id)) {
                // user entered incorrect ID
                swal.showInputError('The Id you entered does\'t match with this information, try again'); return false;
            } else {
              // ID is correct confirm deletion
              swal({
                type: 'warning',
                title: 'Are you sure you want to delete your information?',
                showCancelButton: true,
              }, function () {
                // close alert and delete the data he's deleting
                self.deletePsychologist(i);
              });
            }
        });
    }
  }

  // delte psych's information
  deletePsychologist(index: any): void {
    const self = this;
    this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
      if (res.err != null) {
        /* if an error returned notify the user to try again */
        self.toasterService.error('Something went wrong, please try again.', 'failure');
      } else {
        /* everything went great!! notify the user it was a success then reload. */
        self.getPsychologists();
      }
    });
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['isAdmin'];
    // set 'admin' flag to true if the signed in user is an admin
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      if (res.data) {
        self.admin = res.data.isAdmin;
        self.getPsychologists();
      }
      // else {
      //   self.router.navigateByUrl('/');
      // }
    });
  }

  // get a certain psychologist's data for editing
  getPsychologistData(idIn: String): void {
    let self = this;
    self.psychologistService.getPsychologistData(idIn).subscribe(function (psych) {
      if (psych) {
        self.psychologist = psych.data;
        self.idInput.setValue(null);
        let dialogRef = self.dialog.open(EditPsychComponent, {
          width: '60%',
          height: '90%',
          data: { psych: self.psychologist }
        });
        // open a popup for the editing form
        dialogRef.afterClosed().subscribe(result => {
          self.getPsychologists();
        });
      } else {
        let msg1 = 'The ID you Entered doesn\'t exist,';
        let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
        self.toasterService.error(msg1 + msg2, 'failure');
      }
    });
  }
  // apply sorting criteria
  applySort(x: string): void {
    let self = this;
    self.sort = x;
    self.getPsychologists();
  }

  // apply search by address criteria
  applyAddress(): void {
    let self = this;
    self.selectedAddress = self.writtenAddress;
    self.getPsychologists();
  }

  // apply search criteria
  applySearch(): void {
    let self = this;
    self.selectedSearch = self.writtenSearch;
    self.getPsychologists();
  }

  // remove search criteria
  remove(toRemove: string): void {
    if (toRemove === 'search') {
      this.selectedSearch = null;
      this.writtenSearch = null;
    } else if (toRemove === 'address') {
      this.selectedAddress = null;
      this.writtenAddress = null;
    } else {
      this.sort = null;
    }
    this.getPsychologists();
  }
  onScroll(): void {
    this.pageNumber += 1;
    this.getPage();
  }
}
