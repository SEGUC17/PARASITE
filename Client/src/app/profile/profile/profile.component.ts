import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

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

//---------- Current User Info ---------------
Name: String = "Fulan el Fulany";
Username: String;
Age: Number;
Email: String;
Address: String;
Phone: String;
Birthday: Date;
listOfChildren: any[];
id: any;
//-------------------------------------
//---------Visited User Info-----------
vName: String = "Fulan el Fulany";
vUsername: String;
vAge: Number;
vEmail: String;
vAddress: String;
vPhone: String;
vBirthday: Date;
vlistOfChildren: any[];
vId: any;
//------------------------------------
listOfUncommonChildren: any[];



  constructor(private _ProfileService: ProfileService) { }

  ngOnInit() {

  }

  requestContributerValidation() {
    console.log(this._ProfileService.makeContributerValidationRequest().subscribe());
  }

  showChildren(): void {
    this.listOfUncommonChildren = this.listOfChildren.filter(item => this.vlistOfChildren.indexOf(item) < 0); 
    document.getElementById("childrenLinks").classList.toggle("show");
  }

  addChild(child): void{
    this.listOfChildren.push(child);
    this._ProfileService.linkAnotherParent(this.listOfChildren,this.vId).subscribe();

  }




}
