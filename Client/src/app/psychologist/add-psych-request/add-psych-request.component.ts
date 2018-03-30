import { Component, OnInit } from '@angular/core';
import { AddPsychologistRequest } from './AddPsychologistRequest'
import { AddPsychRequestService } from '../add-psych-request.service'

@Component({
  selector: 'app-add-psych-request',
  templateUrl: './add-psych-request.component.html',
  styleUrls: ['./add-psych-request.component.css']
})
export class AddPsychRequestComponent implements OnInit {

	request: AddPsychologistRequest; 
	sat: boolean = false; sun: boolean = false; mon: boolean = false;
	tue: boolean = false; wed: boolean = false; thu: boolean = false; 
	fri: boolean = false; 
	days: string[];


  constructor(private RequestService : AddPsychRequestService) {
  	
  }

  ngOnInit() {
	this.days = [];
  }


  submitReq(): void{
    
  	var req = this.request;

  	if(this.sat){
  		var d1 = ["Saturday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	if(this.sun){
  		var d1 = ["Sunday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	if(this.mon){
  		var d1 = ["Monday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	if(this.tue){
  		var d1 = ["Tuesday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	if(this.wed){
  		var d1 = ["Wednesday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	if(this.thu){
  		var d1 = ["Thursday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	if(this.fri){
  		var d1 = ["Friday"]; var d2 = this.days; d1 = d1.concat(d2);
  		this.days = d1;
  	}
  	req = {
  		firstName:(<HTMLInputElement>document.getElementById("psychFirstName")).value,
  		lastName: (<HTMLInputElement>document.getElementById("psychLastName")).value,
  		phone: parseInt((<HTMLInputElement>document.getElementById("psychPhoneNumber")).value),
  		address: (<HTMLInputElement>document.getElementById("psychAddress")).value,
  		email: (<HTMLInputElement>document.getElementById("psychEmail")).value ,
  		daysOff: this.days,
  		priceRange: parseInt((<HTMLInputElement>document.getElementById("psychPriceRange")).value),
  		state: "Pending"
	  };

    this.RequestService.addRequest(req).subscribe();
  }

}
