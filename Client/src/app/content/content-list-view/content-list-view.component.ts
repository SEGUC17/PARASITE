import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { PageEvent, MatPaginator } from '@angular/material';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { Category } from '../category';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user';

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

  // categories for the general contents view
  categories: Category;

  // shared between myContributions and content list
  numberOfEntriesPerPage = 5;

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

  // search variables
  searchBy: String = 'title';
  searchQueryTitle: String = '';
  searchQueryTags: String = '';
  isSearching: Boolean = false;

  // signed in user
  currentUser: User;

  // category sidenav and paginator, retrieved from view for manipulation
  @ViewChild('sidenav') public myNav: MatSidenav;
  @ViewChild('allContentPaginator') public paginator: MatPaginator;
  constructor(private contentService: ContentService, @Inject(DOCUMENT) private document: Document, private authService: AuthService) { }

  ngOnInit() {
    const self = this;
    this.authService.getUserData(['username']).
      subscribe(function (user) {
        self.currentUser = user.data;
      });
    this.currentPageNumber = 1;
    this.myContributionsCurrentPageNumber = 1;
    this.getContentPage();
    this.getCategories();
  }

  // retrieves a pagee of general content according to currentPageNumber
  getContentPage(): void {
    const self = this;
    this.contentService.getContentPage(self.numberOfEntriesPerPage,
      self.currentPageNumber, self.selectedCategory, self.selectedSection)
      .subscribe(function (retrievedContents) {
        self.contents = retrievedContents.data.docs;
        self.totalNumberOfEntries = retrievedContents.data.total;
        self.totalNumberOfPages = retrievedContents.data.pages;
        console.log('Total Number of Pages: ' + self.totalNumberOfPages);
      });
  }

  // respond to user changing the page of general content
  onPaginateChange(event): void {
    // pages in the paginator are numbered starting by zero
    // To retrieve correct page from database, add 1
    this.currentPageNumber = event.pageIndex + 1;

    // update the content array
    // check whether we are searching or not
    if (this.isSearching) {
      this.getSearchContentPage();
    } else {
      this.getContentPage();
    }

    this.scrollToTheTop();
  }

  scrollToTheTop(): void {
    document.querySelector('.mat-sidenav-content').scrollTop = 0;
  }

  // respond to the user changing tabs
  tabChanged(event): void {
    if (this.myNav.opened) {
      this.myNav.toggle();
    }
    if (event.tab.textLabel === 'My Contributions' && !this.myContributions) {
      this.getMyContributionsPage();
    }
  }

  // get a page of the content created by the current user
  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.numberOfEntriesPerPage, self.myContributionsCurrentPageNumber).
      subscribe(function (retrievedContents) {
        self.myContributions = retrievedContents.data.docs;
        self.myContributionsTotalNumberOfEntries = retrievedContents.data.total;
        self.myContributionsTotalNumberOfPages = retrievedContents.data.pages;
        console.log('Get Contributions');
      });
  }

  // respond to the user changing the page number of MyContributions section
  onPaginateChangeMyContributions(event): void {
    // pages in the paginator are numbered starting by zero
    // To retrieve correct page from database, add 1
    this.myContributionsCurrentPageNumber = event.pageIndex + 1;
    // update the content array
    this.getMyContributionsPage();

    this.scrollToTheTop();
  }

  // retrieve the categories from the server
  getCategories(): void {
    const self = this;
    this.contentService.getCategories()
      .subscribe(function (retrievedCategories) {
        self.categories = retrievedCategories.data;
      });
  }

  // respond to the user changing the current category and section
  changeCategoryAndSection(category: any, section: any): void {
    this.currentPageNumber = 1;

    // user changed the category or section, nullifying the validity of his search query
    this.isSearching = false;
    this.searchBy = 'title';
    this.searchQueryTitle = '';
    this.searchQueryTags = '';

    // intialize category/section browsing
    this.selectedCategory = category;
    this.selectedSection = section;
    this.paginator.firstPage();
    this.getContentPage();
    this.myNav.toggle();
  }

  // respond to the user clicking the search button
  searchContent(): void {
    this.isSearching = true;
    this.currentPageNumber = 1;
    this.getSearchContentPage();
  }

  // retrieve a page of content that matches the search query
  getSearchContentPage(): void {
    console.log('Searching by: ' + this.searchBy);
    this.searchQueryTags = this.searchQueryTags.trim();
    this.searchQueryTitle = this.searchQueryTitle.trim();
    console.log('Query Tags: ' + this.searchQueryTags);
    console.log('Query Title: ' + this.searchQueryTitle);
    console.log('Retrieving Page: ' + this.currentPageNumber);
  }
}
