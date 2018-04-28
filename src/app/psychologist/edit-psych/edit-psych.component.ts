import { Component, OnInit , Inject} from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsychologistComponent } from '../psychologist/psychologist.component';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Psychologist } from '../psychologist/psychologist';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-psych',
  templateUrl: './edit-psych.component.html',
  styleUrls: ['./edit-psych.component.scss']
})
export class EditPsychComponent implements OnInit {
  psychologist: Psychologist;
  formInput = <any>{};
  user: any = {};
  toggleEditForm = false;
  oldData = <any>{};
  newData = <any>{};
  updatedFields = new Set();

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

  daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];

  id: String;

  constructor(private psychologistService: PsychologistService,
              public dialogRef: MatDialogRef<EditPsychComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.psychologist = data.psych;

  }

  ngOnInit() {
  }

  editPsychologists(): void {
    const self = this;
    console.log(this.firstNameFormControl.value);
    const req = {
      editID: this.psychologist._id,
      firstName: (this.firstNameFormControl.value) ? this.firstNameFormControl.value : this.psychologist.firstName,
      lastName: (this.lastNameFormControl.value) ? this.lastNameFormControl.value : this.psychologist.lastName,
      phone: (this.phoneFormControl.value) ? this.phoneFormControl.value : this.psychologist.phone,
      address: (this.addFormControl.value) ? this.addFormControl.value : this.psychologist.address,
      email: (this.emailFormControl.value) ? this.emailFormControl.value : this.psychologist.email,
      daysOff: (this.daysOff.value) ? this.daysOff.value : this.psychologist.daysOff,
      type: 'edit',
      priceRange: parseInt(((this.priceFormControl.value) ? this.priceFormControl.value : this.psychologist.priceRange), 10)
    };
    this.psychologistService.editRequest(req).subscribe(function (res) {
      if (res.err == null) {
        console.log(res.err);
      }
    });
    self.dialogRef.close();
    console.log(req);
  }

  close(): void {
    /* close dialog */
    this.dialogRef.close();
  }
}
