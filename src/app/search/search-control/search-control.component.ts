import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { User } from '../user';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { PageEvent, MatPaginator } from '@angular/material';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss']
})
export class SearchControlComponent implements OnInit {
  users: User[];
  tag: string;
  tags: string[];
  removable: Boolean = true;
  currPage: number;
  numberPerPage = 10;
  totParents: number;
  totPages: number;
  searchKey: string;
  selectedUsername: string;
  eduL: string;
  eduS: string;
  loc: string;
  filter: string[];
  i: number;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];


  constructor(private searchService: SearchService) { }
  // removing a tag from the search delimiters if removed by user
  remove(tab: string): void {
    const self = this;
    switch (tab) {
      case 'user': this.tags[0] = 'NA'; break;
      case 'eduL': this.tags[1] = 'NA'; break;
      case 'eduS': this.tags[2] = 'NA'; break;
      case 'loc': this.tags[3] = 'NA'; break;
    }
    console.log('updating');
    // updating the search result according to the new set of tags
    this.currPage = 1;
    this.getCurrPage();
    console.log(self.tags[0] + ' ' + self.tags[1] + ' ' + self.tags[2] + ' ' + self.tags[3]);
  }

  firstPage(): void {
    const self = this;
    self.currPage = 1;
    self.users = [];
    self.getParents();
  }
  removeTags(): void {
    this.filter = [];
    this.tags = ['NA', 'NA', 'NA', 'NA'];
  }
  // updating the tags used to search according to tab
  getParents() {
    const self = this;

    if (this.filter[0] === 'user' && this.filter[1] !== 'eduL'
      && this.filter[2] !== 'eduS' && this.filter[3] !== 'loc') {
      this.tags[0] = this.searchKey;
    }
    if (this.filter[0] !== 'user' && this.filter[1] === 'eduL'
      && this.filter[2] !== 'eduS' && this.filter[3] !== 'loc') {
      this.tags[1] = this.searchKey;
    }
    if (this.filter[0] !== 'user' && this.filter[1] !== 'eduL'
      && this.filter[2] !== 'eduS' && this.filter[3] === 'loc') {

      this.tags[3] = this.searchKey;
    }

    // updating search page according to new set of tags
    this.currPage = 1;
    this.getCurrPage();

  }
  applyEDUS(input: string) {
    if (this.filter[0] !== 'user' && this.filter[1] !== 'eduL'
      && this.filter[2] === 'eduS' && this.filter[3] !== 'loc') {
      this.tags[2] = input;
    }
    this.currPage = 1;
    this.getCurrPage();
  }
  showFilter(option: string, index: any) {
    for (this.i = 0; this.i < this.filter.length; this.i++) {
      if (this.i !== index) {
        this.filter[this.i] = 'NA';
      }
    }
    this.filter[index] = option;
  }
  // navigating to profile clicked on
  goToProfile(username: string) {
    this.searchService.viewProfile(username);
  }

  // calculate the number of pages to display in pagination
  getPaginationRange(): any {

    let pageNumbers = [];
    let counter = 1;

    if (this.currPage < 3) {
      // we are in page 1 or 2
      while (counter < 6 && counter <= this.totPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
      // we are in a page greater than 2
      pageNumbers.push(this.currPage - 2);
      pageNumbers.push(this.currPage - 1);
      pageNumbers.push(this.currPage);
      if (this.currPage + 1 <= this.totPages) {
        pageNumbers.push(this.currPage + 1);
      }
      if (this.currPage + 2 <= this.totPages) {
        pageNumbers.push(this.currPage + 2);
      }
    }
    return pageNumbers;
  }
  // getting the page according to the index
  getPage(event): void {

    this.currPage = event.pageIndex + 1;
    this.searchService.getParents(this.tags, this.currPage, this.numberPerPage
    ).subscribe(function (retreivedUsers) {
      this.users = retreivedUsers.data.docs;
    });
  }
  // getting the content of the current page
  getCurrPage(): void {
    this.searchService.getParents(this.tags, this.currPage, this.numberPerPage
    ).subscribe(function (retreivedUsers) {
      this.users = retreivedUsers.data.docs,
        this.totPages = retreivedUsers.data.pages,
        this.totParents = retreivedUsers.data.total;
    });
  }
  changePage(pageNumber: number): void {

    this.currPage = pageNumber;
    window.scrollTo(0, 0);
    this.getParents();
  }
  // initializing all the parameters to starter values
  ngOnInit() {
    let self = this;
    this.currPage = 1;
    this.tags = ['NA', 'NA', 'NA', 'NA'];
    this.users = [];
    this.removable = true;
    this.getCurrPage();
    this.filter = [];
    self.currPage = 1;
    self.firstPage();
    self.getParents();

  }

}
