import { Component, OnInit , Inject} from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsychologistComponent } from '../psychologist/psychologist.component';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Psychologist } from '../psychologist/psychologist';
import { TranslateService } from '@ngx-translate/core';
declare const $: any;


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

  daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  id: String;

  constructor(private psychologistService: PsychologistService,
              public dialogRef: MatDialogRef<EditPsychComponent>,
              public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.psychologist = data.psych;

  }

  ngOnInit() {
    $('.mat-dialog-container').css('padding', '0px');
    $('.mat-dialog-container').css('height', '556');
  }

  editPsychologists(): void {
    const self = this;
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
      }
    });
    self.dialogRef.close();
  }

  close(): void {
    /* close dialog */
    this.dialogRef.close();
  }
}
