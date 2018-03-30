import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { PageEvent } from '@angular/material';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.css']
})
export class ContentListViewComponent implements OnInit {

  contents: Content[];
  myContributions: Content[];
  // TODO set username
  username: String = 'Omar K.';
  currentPageNumber: number;
  numberOfEntriesPerPage = 12;
  selectedCategory: String = 'NoCat';
  selectedSection: String = 'NoSec';
  totalNumberOfPages: number;
  totalNumberOfEntries: number;

  constructor(private contentService: ContentService, @Inject(DOCUMENT) private document: Document) { }

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
        self.totalNumberOfEntries = retriedNumberOfPages.data;
        self.totalNumberOfPages = Math.ceil(self.totalNumberOfEntries / self.numberOfEntriesPerPage);
        // for debugging
        console.log('Total Number of Pages: ' + self.totalNumberOfPages);
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

  onPaginateChange(event): void {
    // pages in the paginator are numbered starting by zero
    // To retrieve correct page from database, add 1
    this.currentPageNumber = event.pageIndex + 1;
    // update the content array
    this.getContentPage();

    this.scrollToTheTop();
  }

  scrollToTheTop(): void {
    console.log('Scrolling!');
    // TODO add scrolling functionality
  }

  tabChanged(event): void {
    if (event.tab.textLabel === 'My Contributions' && !this.myContributions) {
      console.log('Entered tab changed, and retrieving contributions.');
      this.getMyContributions();
    }
  }

  getMyContributions(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.username).
      subscribe(function (retrievedContents) {
        self.myContributions = retrievedContents.data;
      });
  }
}
