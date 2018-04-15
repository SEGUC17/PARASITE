
/* tslint-disable max-len */
/* tslint-disable max-statements */

import { Component, OnInit } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AddPsychRequestComponent } from '../add-psych-request/add-psych-request.component';
import { EditPsychComponent } from '../edit-psych/edit-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Psychologist } from '../psychologist/psychologist';


@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.scss']
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
  addRequest(): void {
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
    if (this.admin) {
      this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
        if (res.err != null) {
          /* if an error returned notify the user to try again */
          self.snackBar.open('Something went wrong, please try again.', '', {
            duration: 2500
          });
        } else {
          /* everything went great!! notify the user it was a success then reload. */
          self.snackBar.open(res.msg, '', {
            duration: 2300
          });
          self.getPsychologists();
        }
      });
    } else {

      // if not admin, check if the input ID is same as the card ID
      if (this.idInput.value === self.psychologists[index]._id) {
        this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
          if (res.err != null) {
            /* if an error returned notify the user to try again */
            self.snackBar.open('Something went wrong, please try again.', '', {
              duration: 2500
            });
            self.getPsychologists();
          } else {
            /* everything went great!! notify the user it was a success then reload. */
            self.snackBar.open(res.msg, '', {
              duration: 2300
            });
            self.idInput.setValue(null);
            self.getPsychologists();
          }
        });
      } else {
        // user entered th wrong ID
        let msg1 = 'The ID you Entered doesn\'t match the Information you selected,';
        let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
        self.snackBar.open(msg1 + msg2, '', {
          duration: 3500
        });
      }
    }
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      if (res.user) {
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


  goToEdit(i): void {
    const self = this;
    if (!(this.idInput.value === this.psychologists[i]._id)) {
      let msg1 = 'The ID you Entered doesn\'t match the Information you selected,';
      let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
      self.snackBar.open(msg1 + msg2, '', {
        duration: 3500
      });
    } else {
      this.getPsychologistData(this.idInput.value);
    }

  }
}
