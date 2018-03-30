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
  // general contents for viewing
  contents: Content[];

  // content created by the current user
  myContributions: Content[];

  // TODO set username
  username: String = 'Omar K.';

  // shared between myContributions and content list
  numberOfEntriesPerPage = 12;

  // for content list pagination
  totalNumberOfPages: number;
  totalNumberOfEntries: number;
  selectedCategory: String = 'NoCat';
  selectedSection: String = 'NoSec';
  currentPageNumber: number;

  // for my contributions pagination
  myContributionsTotalNumberOfEntries: number;
  myContributionsTotalNumberOfPages: number;
  myContributionsCurrentPageNumber: number;

  constructor(private contentService: ContentService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.currentPageNumber = 1;
    this.myContributionsCurrentPageNumber = 1;
    this.intitializeContentViewWithFirstPage();
  }

  // TODO methods to call service
  // retrieves the number of content pages and displays the first page
  intitializeContentViewWithFirstPage(): void {
    const self = this;
    this.contentService.getNumberOfContentPages(self.numberOfEntriesPerPage,
      self.selectedCategory, self.selectedSection)
      .subscribe(function (retriedNumberOfEntries) {
        self.totalNumberOfEntries = retriedNumberOfEntries.data;
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
        self.contents = retrievedContents.data.docs;
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
      this.intitializeMyContributionsViewWithFirstPage();
    }
  }

  intitializeMyContributionsViewWithFirstPage(): void {
    const self = this;
    this.contentService.getNumberOfContentByCreator(self.username)
      .subscribe(function (retrievedNumberOfEntries) {
        self.myContributionsTotalNumberOfEntries = retrievedNumberOfEntries.data;
        self.myContributionsTotalNumberOfPages = Math.ceil(self.myContributionsTotalNumberOfEntries / self.numberOfEntriesPerPage);
        // for debugging
        console.log('Total Number of Pages My Contributions: ' + self.myContributionsTotalNumberOfPages);
        self.getMyContributionsPage();
      });

  }
  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.username, self.numberOfEntriesPerPage, self.myContributionsCurrentPageNumber).
      subscribe(function (retrievedContents) {
        self.myContributions = retrievedContents.data.docs;
        console.log(self.myContributions);
      });
  }

  onPaginateChangeMyContributions(event): void {
    // pages in the paginator are numbered starting by zero
    // To retrieve correct page from database, add 1
    this.myContributionsCurrentPageNumber = event.pageIndex + 1;
    // update the content array
    this.getMyContributionsPage();

    this.scrollToTheTop();
  }
}
