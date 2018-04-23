import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { Inject } from '@angular/core';
import { Category } from '../category';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-list-view',
  templateUrl: './content-list-view.component.html',
  styleUrls: ['./content-list-view.component.scss']
})
export class ContentListViewComponent implements OnInit {
  // general contents for viewing
  contents: Content[] = [];

  // categories for the general contents view
  categories: Category;

  // determine which tab we are on
  selectedTabIndex: Number = 0;

  // shared between myContributions and content list
  numberOfEntriesPerPage = 20;

  // for content list pagination
  selectedCategory: String = '';
  selectedSection: String = '';
  currentPageNumber = 1;
  totalNumberOfPages = 0;

  // search variables
  searchQuery: String = '';

  // sorting variables
  sortResultsBy: String = 'relevance';

  // content language to filter in search
  contentLanguage: String = 'english';

  // signed in user
  currentUser: User;

  constructor(private contentService: ContentService, private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const self = this;
    this.authService.getUserData(['username', 'avatar']).
      subscribe(function (user) {
        self.currentUser = user.data;
      });
    this.getContentPage();
    this.getCategories();
  }

  // extract the first ten tags of a certain content
  getFirstTenTags(tags: any): any {
    if (tags) {
      return tags.slice(0, 10);
    } else {
      return [];
    }
  }

  // calculate the number of pages to display in pagination
  getPaginationRange(): any {

    let pageNumbers = [];
    let counter = 1;

    if (this.currentPageNumber < 3) {
      // we are in page 1 or 2
      while (counter < 6 && counter <= this.totalNumberOfPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
      // we are in a page greater than 2
      pageNumbers.push(this.currentPageNumber - 2);
      pageNumbers.push(this.currentPageNumber - 1);
      pageNumbers.push(this.currentPageNumber);
      if (this.currentPageNumber + 1 <= this.totalNumberOfPages) {
        pageNumbers.push(this.currentPageNumber + 1);
      }
      if (this.currentPageNumber + 2 <= this.totalNumberOfPages) {
        pageNumbers.push(this.currentPageNumber + 2);
      }
    }
    return pageNumbers;
  }

  // respond to the user changing the tab
  changeTab(tabIndex: number): void {
    this.selectedTabIndex = tabIndex;
    this.selectedCategory = '';
    this.selectedSection = '';
    this.changePage(1);
  }

  // respond to user changing the page
  changePage(pageNumber: number): void {

    // increment the page number
    this.currentPageNumber = pageNumber;

    // scroll to the top
    window.scrollTo(0, 0);

    // update the content array
    if (this.selectedTabIndex === 0) {
      this.getContentPage();
    } else {
      this.getMyContributionsPage();
    }
  }

  // get a page of the content created by the current user
  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.numberOfEntriesPerPage, self.currentPageNumber,
        self.selectedCategory, self.selectedSection).
      subscribe(function (retrievedContents) {
        // assign the retrieved contents to the contents array
        self.contents = retrievedContents.data.docs;
        self.totalNumberOfPages = retrievedContents.data.pages;
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
    this.searchQuery = '';

    // intialize category/section browsing
    this.selectedCategory = category;
    this.selectedSection = section;

    // return to page 1
    this.changePage(1);
  }

  // respond to the user clicking the search button
  searchContent(): void {
    // reset contents array
    this.contents = [];
    this.currentPageNumber = 1;

    // get first page of search content
    this.getContentPage();
  }

  // retrieve a page of content that matches the search query
  getContentPage(): void {
    const self = this;
    // remove unnecessary spaces
    this.searchQuery = this.searchQuery.trim();

    // print statements for debugging
    console.log('Query Tags: ' + this.searchQuery);
    console.log('Retrieving Page: ' + this.currentPageNumber);

    // retrieve search page from the server
    this.contentService.getSearchPage(
      self.currentPageNumber,
      self.numberOfEntriesPerPage,
      self.searchQuery,
      self.selectedCategory,
      self.selectedSection,
      self.sortResultsBy,
      self.contentLanguage
    ).subscribe(function (res) {
      let retrievedContent = res.data.contents.docs;
      let retrievedAvatars = res.data.userAvatars;
      // match the retrieved content to their avatars
      for (let counter = 0; counter < retrievedContent.length; counter += 1) {
        retrievedContent[counter].creatorAvatarLink = retrievedAvatars.find(
          function (element) {
            return element.username === retrievedContent[counter].creator;
          }
        ).avatar;
      }
      // update the contents array
      self.contents = retrievedContent;
      self.totalNumberOfPages = res.data.contents.pages;
    });
  }

}
