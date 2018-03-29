import { Component, OnInit } from '@angular/core';
import {Content} from '../content';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.css']
})
export class ContentListViewComponent implements OnInit {

  content: Content = {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  };

  constructor() { }

  ngOnInit() {
  }

}
