import { Component, OnInit } from '@angular/core';
import { AddPsychologistRequest } from './AddPsychologistRequest'
import { AddPsychRequestService } from '../add-psych-request.service'
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
	days: string[];

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  fNameFormControl = new FormControl('', [
    Validators.required
  ]);

  lNameFormControl = new FormControl('', [
    Validators.required
  ]);

  daysOff = new FormControl();

  daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


  matcher = new MyErrorStateMatcher();


  constructor(private RequestService: AddPsychRequestService) {}

  ngOnInit() {
    this.days = [];
  }


  chooseDay(day: string[]): void {
    this.days = day;
  }

  submitReq(): void{

    var error = false;

    if(((<HTMLInputElement>document.getElementById("psychFirstName")).value) == "" 
      || ((<HTMLInputElement>document.getElementById("psychFirstName")).value) === 'undefined' 
      || ((<HTMLInputElement>document.getElementById("psychLastName")).value) == ""
      || ((<HTMLInputElement>document.getElementById("psychLastName")).value) === 'undefined' 
      || ((<HTMLInputElement>document.getElementById("psychEmail")).value) == "" 
      || ((<HTMLInputElement>document.getElementById("psychEmail")).value) === 'undefined' ){
            error = true;
    }

    if(!error){
    	var req = this.request;

    	req = {
    		firstName:((<HTMLInputElement>document.getElementById("psychFirstName")).value).toString(),
    		lastName: (<HTMLInputElement>document.getElementById("psychLastName")).value,
    		phone: parseInt((<HTMLInputElement>document.getElementById("psychPhoneNumber")).value),
    		address: (<HTMLInputElement>document.getElementById("psychAddress")).value,
    		email: (<HTMLInputElement>document.getElementById("psychEmail")).value ,
    		daysOff: this.days,
    		priceRange: parseInt((<HTMLInputElement>document.getElementById("psychPriceRange")).value),
    		state: "Pending"
  	  };

      this.RequestService.addRequest(req).subscribe()
    };
  }

}
