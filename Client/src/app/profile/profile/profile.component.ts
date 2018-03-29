import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  constructor(private _ProfileService: ProfileService) { }
  Name: String = "Fulan el Fulany";
  Username: String;
  Age: Number;
  Email: String;
  Address: String;
  Phone: String;
  Birthday: Date;
  
  ngOnInit() {

  }

  requestContributerValidation() {

  }

  openTab(evt: Event,tabname): void {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        if(!(tablinks[i].getElementById()))
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabname).style.display = "block";
    document.getElementById(tabname + "btn").className += "active";
    //evt.currentTarget.className += " active";
  }


}
