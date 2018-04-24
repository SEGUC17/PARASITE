
/* tslint-disable max-len */
/* tslint-disable max-statements */

import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef  } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AddPsychRequestComponent } from '../add-psych-request/add-psych-request.component';
import { EditPsychComponent } from '../edit-psych/edit-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Psychologist } from '../psychologist/psychologist';
declare const swal: any;

@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PsychologistComponent implements OnInit {

  user: any;
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
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog) { }
  formInput = <any>{};

  showEditPrompt(i): void {
    const self = this;
    console.log(this.admin);
    if (this.admin) {
      self.getPsychologistData(self.psychologists[i]._id);
    } else {
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
              swal.showInputError('The Id you entered does\'t match with this information, try again'); return false;
          }
          swal.close();
          self.getPsychologistData(inputValue);
      });
    }
  }
  showDeletePrompt(i): void {
    const self = this;
    if (this.admin) {
      self.deletePsychologist(self.psychologists[i]._id);
    } else {
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
                swal.showInputError('The Id you entered does\'t match with this information, try again'); return false;
            } else {
              swal({
                type: 'warning',
                title: 'Are you sure you want to delete your information?',
                showCancelButton: true,
              }, function () {
                self.deletePsychologist(i);
                // swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
              });
            }
        });
    }
  }

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
  deletePsychologist(index: any): void {
    const self = this;
    this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
      if (res.err != null) {
        /* if an error returned notify the user to try again */
        self.snackBar.open('Something went wrong, please try again.', '', {
          duration: 2500
        });
      } else {
        /* everything went great!! notify the user it was a success then reload. */
        self.getPsychologists();
      }
    });
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      if (res.user) {
        console.log(self.user.isAdmin);
        self.user = res.data;
        self.admin = self.user.isAdmin;
      }
      self.getPsychologists();
    });
  }

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
        dialogRef.afterClosed().subscribe(result => {
          self.getPsychologists();
        });
      } else {
        let msg1 = 'The ID you Entered doesn\'t exist,';
        let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
        self.snackBar.open(msg1 + msg2, '', {
          duration: 3500
        });
      }
    });
  }
  applySort(x: string): void {
    let self = this;
    self.sort = x;
    self.getPsychologists();
  }
  applyAddress(): void {
    let self = this;
    self.selectedAddress = self.writtenAddress;
    self.getPsychologists();
  }
  applySearch(): void {
    let self = this;
    self.selectedSearch = self.writtenSearch;
    self.getPsychologists();
  }
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


  // goToEdit(i, givenId): void {
  //   if (this.admin) {
  //     this.getPsychologistData(this.idInput.value);
  //   } else {
  //     const self = this;
  //     if (!(givenId === this.psychologists[i]._id)) {
  //       let msg1 = 'The ID you Entered doesn\'t match the Information you selected,';
  //       let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
  //       self.snackBar.open(msg1 + msg2, '', {
  //         duration: 3500
  //       });
  //     } else {
  //       this.getPsychologistData(this.idInput.value);
  //     }
  //   }

  // }
}
