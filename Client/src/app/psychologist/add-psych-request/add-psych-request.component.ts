import { Component, OnInit } from '@angular/core';
import { AddPsychologistRequest } from './AddPsychologistRequest';
import { PsychologistService } from '../psychologist.service';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-psych-request',
  templateUrl: './add-psych-request.component.html',
  styleUrls: ['./add-psych-request.component.scss']
})
export class AddPsychRequestComponent implements OnInit {
  request: AddPsychologistRequest;

  daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];

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

  matcher = new MyErrorStateMatcher();


  constructor(private RequestService: PsychologistService,
              public snackBar: MatSnackBar) {

  }

  ngOnInit() {
  }

  /* called when user clicks on submit button */
  submitReq(): void {
    let self = this;

    /* check if any of the required fields are empty, if yes notify user he should fill them*/
    if (this.emailFormControl.hasError('required') || this.firstNameFormControl.hasError('required')
        || this.lastNameFormControl.hasError('required')) {
            this.snackBar.open('Please fill all the required fields', '', {
              duration: 1500
            });
    } else if (this.emailFormControl.hasError('email')) {
      // if the emil user provided is not the in correct format
      // notify user he should enter a valid email
      this.snackBar.open('Please enter a valid email address!', '', {
        duration: 1500
      });
    } else {
      let req = this.request;

      /* create a request object with user's info */
      req = {
        firstName: this.firstNameFormControl.value,
        lastName: this.lastNameFormControl.value,
        phone: this.phoneFormControl.value,
        address: this.addFormControl.value,
        email: this.emailFormControl.value,
        daysOff: this.daysOff.value,
        priceRange: parseInt(this.priceFormControl.value, 10)
      };

      /* make a POST request with the request data */
      this.RequestService.addRequest(req).subscribe(function (res) {
        if (res.err != null) {
          /* if an error returned notify the user to try again */
          self.snackBar.open('Something went wrong, please try again.', '', {
            duration: 2500
          });
        } else {
          /* everything went great!! notify the user it was a success. */
          self.snackBar.open(res.msg, '', {
            duration: 2300
          });

          /* clear the request form */
          self.firstNameFormControl.setValue(null);
          self.lastNameFormControl.setValue(null);
          self.phoneFormControl.setValue(null);
          self.addFormControl.setValue(null);
          self.emailFormControl.setValue(null);
          self.daysOff.setValue(null);
          self.priceFormControl.setValue(null);
        }
      });
    }
  }
}
