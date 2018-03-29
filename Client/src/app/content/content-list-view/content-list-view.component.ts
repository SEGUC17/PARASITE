import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.css']
})
export class ContentListViewComponent implements OnInit {

  contents: Content[];

  constructor(private contentService: ContentService ) { }

  ngOnInit() {
  }

  // TODO methods to call service

}
