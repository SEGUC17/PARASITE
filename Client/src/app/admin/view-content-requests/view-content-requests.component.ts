import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.css']
})
export class ViewContentRequestsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  test() {
    console.log('child component called ');
  }

}
