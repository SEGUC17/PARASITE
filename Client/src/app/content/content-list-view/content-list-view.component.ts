import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.css']
})
export class ContentListViewComponent implements OnInit {

  content: Object = {title: 'Best Resource for Learning C#',
creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
creatorAvatar: 'assets/images/content-view/profiletest.jpg'} ;

  constructor() { }

  ngOnInit() {
  }

}
