import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})
export class AdminControlComponent implements OnInit {

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  viewProdRequests(){
    this.router.navigateByUrl('/admin/prod-req');
  }
}
