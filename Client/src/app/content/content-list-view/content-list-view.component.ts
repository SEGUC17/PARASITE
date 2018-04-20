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

  // content created by the current user
  myContributions: Content[] = [];

  // categories for the general contents view
  categories: Category;

  // determine which tab we are on
  selectedTab: Number = 0;

  // shared between myContributions and content list
  numberOfEntriesPerPage = 20;

  // for content list pagination
  selectedCategory: String = '';
  selectedSection: String = '';
  currentPageNumber = 1;
  totalNumberOfPages = 0;

  // for my contributions pagination
  myContributionsSelectedCategory: String = '';
  myContributionsSelectedSection: String = '';
  myContributionsCurrentPageNumber = 1;

  // search variables
  searchQuery: String = '';

  // sorting variables
  sortResultsBy: String = 'relevance';
  sortOptions = ['relevance', 'upload date', 'rating'];

  // signed in user
  currentUser: User;

  constructor(private contentService: ContentService, private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const self = this;
    this.authService.getUserData(['username', 'avatar']).
      subscribe(function (user) {
        self.currentUser = user.data;
        if (self.currentUser) {
          self.getMyContributionsPage();
        }
      });
    this.getContentPage();
    this.getCategories();
  }

  // extract the first ten tags of a certain content
  getFirstTenTags(tags: any): any {
    return tags.slice(0, 10);
  }

  // calculate the number of pages to display in pagination
  getPaginationRange(): any {
    let pageNumbers = [];
    let counter = 1;
    if (this.currentPageNumber < 3) {
      while (counter < 6 && counter <= this.totalNumberOfPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
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

  // respond to user scrolling to the end of the general content
  pageChange(pageNumber: number): void {
    console.log('Changed Page');
    // increment the page number
    this.currentPageNumber = pageNumber;
    window.scrollTo(0, 0);

    // update the content array
    this.getContentPage();
  }

  // respond to user scrolling to the end of the my contributions section
  onScrollMyContributions(): void {
    console.log('scrolled!!');
    // increment the page number
    this.myContributionsCurrentPageNumber += 1;

    // update the content array
    this.getMyContributionsPage();
  }

  // get a page of the content created by the current user
  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.numberOfEntriesPerPage, self.myContributionsCurrentPageNumber,
        self.myContributionsSelectedCategory, self.myContributionsSelectedSection).
      subscribe(function (retrievedContents) {
        // append a new page to the myContributions array
        self.myContributions = self.myContributions.concat(retrievedContents.data.docs);
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
    // we are in the general content tab
    if (this.selectedTab === 0) {
      // user changed the category or section, nullifying the validity of his search query
      this.searchQuery = '';

      // intialize category/section browsing
      this.selectedCategory = category;
      this.selectedSection = section;

      // start from page 1
      this.currentPageNumber = 1;
      this.contents = [];
      this.getContentPage();
    } else {
      // initialize category/section for my contributions
      this.myContributionsSelectedCategory = category;
      this.myContributionsSelectedSection = section;

      // start from page 1
      this.myContributionsCurrentPageNumber = 1;
      this.myContributions = [];
      this.getMyContributionsPage();
    }
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
      self.sortResultsBy
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
      console.log(self.totalNumberOfPages);
    });
  }

  checkCreatorProfile(username: String) {
    this.router.navigateByUrl('/profile/' + username);
  }
}
