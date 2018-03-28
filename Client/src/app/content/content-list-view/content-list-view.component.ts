import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.css']
})
export class ContentListViewComponent implements OnInit {

  contents: Content[] = [{
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  },
  {
    id: '198387492',
    title: 'Best Resource for Learning C#',
    contentImage: 'assets/images/content-view/contentimagetest.jpg',
    creatorUsername: 'OmarK', creatorProfileLink: 'http://mywebsite.com/OmarK',
    creatorAvatar: 'assets/images/content-view/profiletest.jpg',
    tags: ['programming', 'beginner', 'C#', 'clickbait', 'life', 'mood', 'fatality', 'engineering concepts', 'computer science']
  }];

  constructor(private contentService: ContentService ) { }

  ngOnInit() {
  }

}
