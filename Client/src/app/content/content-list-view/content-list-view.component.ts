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
  currentPageNumber: number;
  numberOfEntriesPerPage = 10;
  selectedCategory: String;
  selectedSection: String;
  totalNumberOfPages: number;

  constructor(private contentService: ContentService ) { }

  ngOnInit() {
    this.currentPageNumber = 1;
    this.intitializeViewWithFirstPage();
  }

  // TODO methods to call service
  // retrieves the number of content pages and displays the first page
  intitializeViewWithFirstPage(): void {
    const self = this;
    this.contentService.getNumberOfContentPages(self.numberOfEntriesPerPage,
      self.selectedCategory, self.selectedSection)
      .subscribe(function (retriedNumberOfPages) {
        self.totalNumberOfPages = retriedNumberOfPages.data;
        self.getContentPage();
      });
  }

  // retrieves the contents of a particular page according to currentPageNumber
  getContentPage(): void {
    const self = this;
    this.contentService.getContentPage(self.numberOfEntriesPerPage,
      self.currentPageNumber, self.selectedCategory, self.selectedSection)
      .subscribe(function (retrievedContents) {
        self.contents = retrievedContents.data;
      });
  }

}
