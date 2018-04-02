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

  // TODO set username
  username: String = 'Omar K.';

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

  @ViewChild('sidenav') public myNav: MatSidenav;
  @ViewChild('allContentPaginator') public paginator: MatPaginator;
  constructor(private contentService: ContentService, @Inject(DOCUMENT) private document: Document, private authService: AuthService) { }

  ngOnInit() {
    console.log(this.authService.getUser());
    this.currentPageNumber = 1;
    this.myContributionsCurrentPageNumber = 1;
    this.getContentPage();
    this.getCategories();
  }

  // retrieves the contents of a particular page according to currentPageNumber
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

  onPaginateChange(event): void {
    // pages in the paginator are numbered starting by zero
    // To retrieve correct page from database, add 1
    this.currentPageNumber = event.pageIndex + 1;

    // update the content array
    this.getContentPage();

    this.scrollToTheTop();
  }

  scrollToTheTop(): void {
    document.querySelector('.mat-sidenav-content').scrollTop = 0;
  }

  tabChanged(event): void {
    if (this.myNav.opened) {
      this.myNav.toggle();
    }
    if (event.tab.textLabel === 'My Contributions' && !this.myContributions) {
      this.getMyContributionsPage();
    }
  }

  getMyContributionsPage(): void {
    const self = this;
    this.contentService.
      getContentByCreator(self.authService.getUser().username , self.numberOfEntriesPerPage, self.myContributionsCurrentPageNumber).
      subscribe(function (retrievedContents) {
        self.myContributions = retrievedContents.data.docs;
        self.myContributionsTotalNumberOfEntries = retrievedContents.data.total;
        self.myContributionsTotalNumberOfPages = retrievedContents.data.pages;
        console.log('Get Contributions: ' + self.authService.getUser());
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

  getCategories(): void {
    const self = this;
    this.contentService.getCategories()
      .subscribe(function (retrievedCategories) {
        self.categories = retrievedCategories.data;
      });
  }

  changeCategoryAndSection(category: any, section: any): void {
    this.currentPageNumber = 1;
    this.selectedCategory = category;
    this.selectedSection = section;
    this.paginator.firstPage();
    this.getContentPage();
    this.myNav.toggle();
  }
}
