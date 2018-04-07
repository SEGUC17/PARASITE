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
  styleUrls: ['./add-psych-request.component.css']
})
export class AddPsychRequestComponent implements OnInit {

  request: AddPsychologistRequest;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  firstNameFormControl = new FormControl('', [
    Validators.required
  ]);

  lastNameFormControl = new FormControl('', [
    Validators.required
  ]);

  addFormControl = new FormControl();
  phoneFormControl = new FormControl();
  daysOff = new FormControl();
  priceFormControl = new FormControl();

  daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];


  matcher = new MyErrorStateMatcher();


  constructor(private RequestService: PsychologistService,
              public snackBar: MatSnackBar) {

  }

  ngOnInit() {
  }


  submitReq(): void {
    let self = this;

    if (this.emailFormControl.hasError('required') || this.firstNameFormControl.hasError('required')
        || this.lastNameFormControl.hasError('required')) {
            this.snackBar.open('Please fill all the required fields', '', {
              duration: 1500
            });
    } else if (this.emailFormControl.hasError('email')) {
      this.snackBar.open('Please enter a valid email address!', '', {
        duration: 1500
      });
    } else {
      let req = this.request;

      req = {
        firstName: this.firstNameFormControl.value,
        lastName: this.lastNameFormControl.value,
        phone: this.phoneFormControl.value,
        address: this.addFormControl.value,
        email: this.emailFormControl.value,
        daysOff: this.daysOff.value,
        priceRange: parseInt(this.priceFormControl.value, 10)
      };

      this.RequestService.addRequest(req).subscribe(function (res) {
        if (res.msg !== 'Request was created successfully.') {
          self.snackBar.open('Something went wrong, please try again.', '', {
            duration: 2000
          });
        } else {
          self.snackBar.open('Request Sent Successfully!', '', {
            duration: 2000
          });

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
