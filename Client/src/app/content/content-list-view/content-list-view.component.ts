import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { Inject } from '@angular/core';
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
  contents: Content[] = [];

  // content created by the current user
  myContributions: Content[] = [];

  // categories for the general contents view
  categories: Category;

  // shared between myContributions and content list
  numberOfEntriesPerPage = 20;

  // for content list pagination
  totalNumberOfEntries: number;
  selectedCategory: String = 'NoCat';
  selectedSection: String = 'NoSec';
  currentPageNumber = 1;

  // for my contributions pagination
  myContributionsTotalNumberOfEntries: number;
  myContributionsCurrentPageNumber = 1;

  // search variables
  searchQueryTitle: String = '';
  searchQueryTags: String = '';
  isSearching: Boolean = false;

  // sorting variables
  sortResultsBy: String = 'title touchDate rating';

  // signed in user
  currentUser: User;

  constructor(private contentService: ContentService, private authService: AuthService) { }

  ngOnInit() {
    const self = this;
    this.authService.getUserData(['username']).
      subscribe(function (user) {
        self.currentUser = user.data;
        if (self.currentUser) {
          self.getMyContributionsPage();
        }
      });
    this.getContentPage();
    this.getCategories();
  }

  // respond to user scrolling to the end of the general content
  onScroll(): void {
    console.log('scrolled!!');
    // increment the page number
    this.currentPageNumber += 1;

    // update the content array
    // check whether we are searching or not
    if (this.isSearching) {
      this.getSearchContentPage();
    } else {
      this.getContentPage();
    }
  }

  // respond to user scrolling to the end of the my contributions section
  onScrollMyContributions(): void {
    console.log('scrolled!!');
    // increment the page number
    this.myContributionsCurrentPageNumber += 1;

    // update the content array
    this.getMyContributionsPage();
  }

  // retrieves a pagee of general content according to currentPageNumber
  getContentPage(): void {
    const self = this;
    this.contentService.getContentPage(self.numberOfEntriesPerPage,
      self.currentPageNumber, self.selectedCategory, self.selectedSection)
      .subscribe(function (retrievedContents) {
        // append a new page of content to general content
        self.contents = self.contents.concat(retrievedContents.data.docs);
        // update the total number of results
        self.totalNumberOfEntries = retrievedContents.data.total;
        console.log('Total Number of Pages: ' + retrievedContents.data.pages);
      });
  }

  // get a page of the content created by the current user
  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.numberOfEntriesPerPage, self.myContributionsCurrentPageNumber).
      subscribe(function (retrievedContents) {
        // append a new page to the myContributions array
        self.myContributions = self.myContributions.concat(retrievedContents.data.docs);
        // update the total number of entries
        self.myContributionsTotalNumberOfEntries = retrievedContents.data.total;
        console.log('Get Contributions');
      });
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

    // user changed the category or section, nullifying the validity of his search query
    this.isSearching = false;
    this.searchQueryTitle = '';
    this.searchQueryTags = '';

    // intialize category/section browsing
    this.selectedCategory = category;
    this.selectedSection = section;

    // start from page 1
    this.currentPageNumber = 1;
    this.contents = [];
    this.getContentPage();
  }

  // respond to the user clicking the search button
  searchContent(): void {
    // user is searching
    this.isSearching = true;

    // reset contents array
    this.contents = [];
    this.currentPageNumber = 1;

    // get first page of search content
    this.getSearchContentPage();
  }

  // retrieve a page of content that matches the search query
  getSearchContentPage(): void {
    const self = this;
    // remove unnecessary spaces
    this.searchQueryTags = this.searchQueryTags.trim();
    this.searchQueryTitle = this.searchQueryTitle.trim();

    // print statements for debugging
    console.log('Query Tags: ' + this.searchQueryTags);
    console.log('Query Title: ' + this.searchQueryTitle);
    console.log('Retrieving Page: ' + this.currentPageNumber);

    // retrieve search page from the server
    this.contentService.getSearchPage(
      self.currentPageNumber,
      self.numberOfEntriesPerPage,
      self.searchQueryTags,
      self.searchQueryTitle,
      self.selectedCategory,
      self.selectedSection,
      self.sortResultsBy
    ).subscribe(function (retrievedContents) {
      // update the contents array
      self.contents = self.contents.concat(retrievedContents.data.docs);
      // update the total number of retrieved items
      self.totalNumberOfEntries = retrievedContents.data.total;
      console.log('Total Number of Pages Search: ' + retrievedContents.data.pages);
    });
  }
}
