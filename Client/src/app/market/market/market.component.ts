import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
// import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToCreate(){
    this.router.navigateByUrl('/market/createProduct');
  }

}
