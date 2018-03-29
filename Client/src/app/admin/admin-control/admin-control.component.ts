import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ViewVerifiedContributerRequestsComponent} from "../view-verified-contributer-requests/view-verified-contributer-requests.component";


@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})
export class AdminControlComponent implements OnInit {

  @ViewChild(ViewVerifiedContributerRequestsComponent) VcComponent;


  constructor() { }

  ngOnInit() {
  }



  test (){
    var el = document.getElementById("comp");
    el.parentNode.removeChild(el);
    console.log("hi");
  }

  addEL(){
    var el = document.getElementById("comp");
    el.parentNode.appendChild(el);

  }

  viewVCRequests(){
    this.VcComponent.testAccess();

  }


}
