import { Component, OnInit } from '@angular/core';

declare const CKEDITOR: any;

@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.css']
})
export class ReportPopUpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      CKEDITOR.replace('ckeditor');
      CKEDITOR.config.height = 300;
  }

}
