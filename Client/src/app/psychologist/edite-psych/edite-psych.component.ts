import { Component, OnInit , Inject} from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsychologistComponent } from '../psychologist/psychologist.component';
import { FormControl, Validators } from '@angular/forms';
import { Psychologist } from '../psychologist/psychologist';




@Component({
  selector: 'app-edite-psych',
  templateUrl: './edite-psych.component.html',
  styleUrls: ['./edite-psych.component.css']
})
export class EditePsychComponent implements OnInit {
  psychologist: Psychologist;
  formInput = <any>{};
  user: any = {};
  toggleEditForm = false;
  oldData = <any>{};
  newData = <any>{};
    updatedFields = new Set();

  id: String;

  constructor(private psychologistService: PsychologistService,   public dialogRef: MatDialogRef<EditePsychComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      // this.oldData = data.product;
      // console.log(this.oldData);
      this.id = data.idd;

  }

  ngOnInit() {
    this.getPsychologistData();
  }
  // need to get the info

  getPsychologistData(): void {
    let self = this;
    self.psychologistService.getPsychologistData(self.id).subscribe(function (psychs) {
      self.psychologist = psychs.data;
      console.log(self.psychologist);
    });
  }

  editPsychologists(): void {
    const editedPsych = {
      firstName: (this.formInput.firstName) ? this.formInput.firstName : this.psychologist.firstName,
      lastName: (this.formInput.lastName) ? this.formInput.lastName : this.psychologist.lastName,
      phone: (this.formInput.phone) ? this.formInput.phone : this.psychologist.phone,
      address: (this.formInput.address) ? this.formInput.address : this.psychologist.address,
      email: (this.formInput.email) ? this.formInput.email : this.psychologist.email,
      daysOff: (this.formInput.daysOff) ? this.formInput.daysOff : this.psychologist.daysOff,
      priceRange: parseInt(((this.formInput.priceRange) ? this.formInput.priceRange : this.psychologist.priceRange), 10)
    };
    console.log(editedPsych);
  }




  // toggleForm() {



  //   if (this.toggleEditForm) {
  //     let self = this;
  //     this.updatedFields.forEach(function (field: String) {
  //       self.newData['' + field] = self.formInput['' + field];
  //     });
  //     console.log(this.newData);
  //     this.toggleEditForm = false;
  //   } else {
  //     this.toggleEditForm = true;
  //     this.formInput = this.oldData;
  //   }
  // }


  addToUpdatedFields(event: any) {
    this.updatedFields.add(event.target.id);
  }

}
