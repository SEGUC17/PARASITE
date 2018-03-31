import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD

=======
import { ProfileService } from '../profile.service';
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
<<<<<<< HEAD
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }


  createProduct(evt,tabname): void {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabname).style.display = "block";
    evt.currentTarget.className += " active";
  }


  
=======


export class ProfileComponent implements OnInit {


  //---------- FLAGS --------------------
//User Flags
currIsOwner = false;
currIsParent = false;
currIsChild = false;
currIsIndependent = false;

visitedIsParent = false;
visitedIsChild = false;
VisitedIsIndependent = false;

//Tab Navigation Flags
pInfo = true;
children = false;
plan = false;
sched = false;

//------------------------------------

//---------- User Info ---------------
Name: String = "Fulan el Fulany";
Username: String;
Age: Number;
Email: String;
Address: String;
Phone: String;
Birthday: Date;
//------------------------------------


  constructor(private _ProfileService: ProfileService) { }

  ngOnInit() {

  }

  requestContributerValidation() {
    console.log(this._ProfileService.makeContributerValidationRequest().subscribe());
  }

  openInfo(): void{
    this.pInfo = true;
    this.children = false;
    this.plan = false;
    this.sched = false;
    document.getElementById("personalinfobtn").className = "active";
    document.getElementById("schedbtn").className = "";
    document.getElementById("childbtn").className = "";
    document.getElementById("plansbtn").className = "";
  }
  openSched(): void{
    this.pInfo = false;
    this.children = false;
    this.plan = false;
    this.sched = true;
    document.getElementById("personalinfobtn").className = "";
    document.getElementById("schedbtn").className = "active";
    document.getElementById("childbtn").className = "";
    document.getElementById("plansbtn").className = "";
  }
  openPlans(): void{
    this.pInfo = false;
    this.children = false;
    this.plan = true;
    this.sched = false;
    document.getElementById("personalinfobtn").className = "";
    document.getElementById("schedbtn").className = "";
    document.getElementById("childbtn").className = "";
    document.getElementById("plansbtn").className = "active";
  }
  openChildren(): void{
    this.pInfo = false;
    this.children = true;
    this.plan = false;
    this.sched = false;
    document.getElementById("personalinfobtn").className = "";
    document.getElementById("schedbtn").className = "";
    document.getElementById("childbtn").className = "active";
    document.getElementById("plansbtn").className = "";
}


>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
}
