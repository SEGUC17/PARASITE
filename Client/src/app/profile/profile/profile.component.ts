import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {


// ---------- FLAGS --------------------
// User Flags
currIsOwner = false;
currIsParent = false;
currIsChild = false;
currIsIndependent = false;

visitedIsParent = false;
visitedIsChild = false;
VisitedIsIndependent = false;

// Tab Navigation Flags
pInfo = true;
children = false;
plan = false;
sched = false;

// ------------------------------------


//---------- Current User Info ---------------

// ---------- Current User Info ---------------
Name: String = 'Fulan el Fulany';
Username: String;
Age: Number;
Email: String;
Address: String;
Phone: String;
Birthday: Date;
listOfChildren: any[] = ['Ahmed','Sally','Mohamed'];
id: any;
//-------------------------------------
//---------Visited User Info-----------


// -------------------------------------
// ---------Visited User Info-----------
vName: String = 'Fulan el Fulany';
vUsername: String;
vAge: Number;
vEmail: String;
vAddress: String;
vPhone: String;
vBirthday: Date;
vlistOfChildren: any[] = ['Sally'];
vId: any = '5ac2a84ffba2ff2be4f0da22';
//------------------------------------


// ------------------------------------
listOfAllChildren: any[];
listOfUncommonChildren: any[];



  constructor(private _ProfileService: ProfileService) { }

  ngOnInit() {
    // this.listOfAllChildren = this.listOfChildren.concat(this.vlistOfChildren);
     this.listOfUncommonChildren = this.listOfChildren.filter(item => this.vlistOfChildren.indexOf(item) < 0);
  }

  requestContributerValidation() {
    console.log(this._ProfileService.makeContributerValidationRequest().subscribe());
  }

  addChild(child): void{

    this.vlistOfChildren.push(child);
    this._ProfileService.linkAnotherParent(this.vlistOfChildren,this.vId).subscribe();

  }


  viewChildren(): void{
    document.getElementById('UnlinkChildren').classList.toggle('show'); 
  }

  removeChild(child): void{
    this.listOfChildren.splice(this.listOfChildren.indexOf(child) , 1);
    this._ProfileService.Unlink(this.listOfChildren, this.id ).subscribe();
  }

  linkToParent(child):void{-
    //this.vlistOfChildren.push(child);
    //this._ProfileService.linkAsParent(child,this.vId).subscribe();

     this._ProfileService.linkAsParent(child,this.vId).subscribe();
  }

  changePassword(oldpw, newpw: any) :void{
    this._ProfileService.changePassword(oldpw, newpw).subscribe();
  }

}
