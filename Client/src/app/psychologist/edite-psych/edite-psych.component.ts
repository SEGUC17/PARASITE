import { Component, OnInit , Inject} from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsychologistComponent } from '../psychologist/psychologist.component';
import { FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-edite-psych',
  templateUrl: './edite-psych.component.html',
  styleUrls: ['./edite-psych.component.css']
})
export class EditePsychComponent implements OnInit {
  psychologists: any[];
  formInput = <any>{};
  user: any = {};

  constructor(private psychologistService: PsychologistService,   public dialogRef: MatDialogRef<EditePsychComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
  }
  //need to get the info 
  getPsychologists(): void {
    let self = this;
    self.psychologistService.getPsychologists().subscribe(function (psychs) {
      self.psychologists = psychs.data;
    });
  }

  editePsychologists(psychologist:any):void{
    let pro = { // here i put the inputs i take and place them in pro
      firstName: this.formInput.firstName,
      lastName: this.formInput.lastName,
      //seller: this.user.username,
      phone: this.formInput.phone,
      address: this.formInput.address,
      email: this.formInput.email,
      daysOff: this.formInput.daysOff,
      priceRange: this.formInput.priceRange,
      createdAt: new Date,
    };

  }

}
