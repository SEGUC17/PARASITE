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
  toggleEditForm = false;
  oldData = <any>{};
  newData = <any>{};
    updatedFields = new Set();

id : String;
  constructor(private psychologistService: PsychologistService,   public dialogRef: MatDialogRef<EditePsychComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {  
      this.oldData = data.product;
      console.log(this.oldData);
      this.id = data.idd;

  }

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
