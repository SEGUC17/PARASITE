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
    @Inject(MAT_DIALOG_DATA) public data: any) {  
       const userDataColumns = ['firstname', 'lastname','email','phone', 'address' , 'priceRange','daysOff'];
    let self = this;
    // this.psychologistService.getPsychologists(userDataColumns).subscribe(function (res) {
    //   if (res.msg === 'Data Retrieval Is Successful!') {
    //     console.log('Got here');
    //     self.user = res.data;
    //     console.log(self.user);
    //   }
    // }
  );

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

    if (((<HTMLInputElement>document.getElementById('firstName')).value) === ''){
      firstname : this.user.firstName;
    }
    if (((<HTMLInputElement>document.getElementById('lastName')).value) === ''){
      lastName : this.user.lastName;
    }
    if (((<HTMLInputElement>document.getElementById('phone')).value) === ''){
      lastName : this.user.phone;
    }
    if (((<HTMLInputElement>document.getElementById('address')).value) === ''){
      lastName : this.user.address;
    }
    if (((<HTMLInputElement>document.getElementById('email')).value) === ''){
      lastName : this.user.email;
    }
    if (((<HTMLInputElement>document.getElementById('daysOff')).value) === ''){
      lastName : this.user.daysOff;
    }
    if (((<HTMLInputElement>document.getElementById('priceRange')).value) === ''){
      lastName : this.user.priceRange;
    }
    
    //call deletePsychologist() from psychologist component 
    //call submitReq() from add-psych component
    
   

  }

}
