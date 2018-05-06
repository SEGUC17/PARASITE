import { Component, OnInit } from '@angular/core';
import { PsychologistRequest } from '../PsychologistRequest';
import { PsychologistService } from '../psychologist.service';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
declare const $: any;

@Component({
  selector: 'app-add-psych-request',
  templateUrl: './add-psych-request.component.html',
  styleUrls: ['./add-psych-request.component.scss']
})
export class AddPsychRequestComponent implements OnInit {
  request: PsychologistRequest;

  daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  /* form controls for each input form field */
  firstNameFormControl = new FormControl('', [
    Validators.required
  ]);

  lastNameFormControl = new FormControl('', [
    Validators.required
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  addFormControl = new FormControl();
  phoneFormControl = new FormControl();
  daysOff = new FormControl();
  priceFormControl = new FormControl();



  constructor(private RequestService: PsychologistService,
              private toasterService: ToastrService,
              public dialogRef: MatDialogRef<AddPsychRequestComponent>,
              public translate: TranslateService) {

  }

  ngOnInit() {
    $('.mat-dialog-container').css('padding', '0px');
    $('.mat-dialog-container').css('height', 'fit-content');
  }

  /* called when user clicks on submit button */
  submitReq(): void {
    let self = this;

    /* check if any of the required fields are empty, if yes notify user he should fill them*/
    if (this.emailFormControl.hasError('required') || this.firstNameFormControl.hasError('required')
        || this.lastNameFormControl.hasError('required')) {
        this.toasterService.error('Please fill all the required fields', 'failure');
    } else if (this.emailFormControl.hasError('email')) {
      // if the emil user provided is not the in correct format
      // notify user he should enter a valid email
      this.toasterService.error('Please enter a valid email address!', 'failure');
    } else {
      let req = this.request;
      if (this.daysOff.value === null) {
        this.daysOff.setValue(['No days off']);
      }
      /* create a request object with user's info */
      req = {
        firstName: this.firstNameFormControl.value,
        lastName: this.lastNameFormControl.value,
        phone: this.phoneFormControl.value,
        address: this.addFormControl.value,
        email: this.emailFormControl.value,
        daysOff: this.daysOff.value,
        type: 'add',
        priceRange: parseInt(this.priceFormControl.value, 10)
      };

      /* make a POST request with the request data */
      this.RequestService.addRequest(req).subscribe(function (res) {
        if (res.err != null) {
          /* if an error returned notify the user to try again */
          self.toasterService.error('Something went wrong, please try again.', 'failure');
        } else {
          /* everything went great!! notify the user it was a success. */
          self.toasterService.success(res.msg, 'success');

          /* close dialog */
          self.dialogRef.close();
        }
      });
    }
  }
  close(): void {
    /* close dialog */
    this.dialogRef.close();
  }
}
