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
  styleUrls: ['./search-control.component.css']
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
  selectedUsername: string;
  eduL: string;
  eduS: string;
  loc: string;


  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  @ViewChild('allSearchPaginator') public paginator: MatPaginator;
  constructor(private searchService: SearchService) { }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;
    console.log('entered');

    if ((value || '').trim()) {
      this.tag = (value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(tab: string): void {
    const self = this;
    switch (tab) {
      case 'user': this.tags[0] = 'NA'; break;
      case 'eduL': this.tags[1] = 'NA'; break;
      case 'eduS': this.tags[2] = 'NA'; break;
      case 'loc': this.tags[3] = 'NA'; break;
    }
    console.log('updating');
    this.currPage = 1;
    this.searchService.getParents(this.tags, this.currPage, this.numberPerPage
    ).subscribe(function (retreivedUsers) {
      self.users = retreivedUsers.data.docs,
        self.totPages = retreivedUsers.data.pages,
        self.totParents = retreivedUsers.data.total;
    });
    console.log(self.tags[0] + ' ' + self.tags[1] + ' ' + self.tags[2] + ' ' + self.tags[3]);
  }

  getParents(tab: String) {
    const self = this;
    switch (tab) {
      case 'user':
        this.tags[0] = this.selectedUsername;
        break;
      case 'eduL':
        this.tags[1] = this.eduL;
        break;
      case 'eduS':
        this.tags[2] = this.eduS;
        break;
      case 'loc':
        this.tags[3] = this.loc;
        break;
    }
    this.searchService.getParents(this.tags, this.currPage, this.numberPerPage
    ).subscribe(function (retreivedUsers) {
      self.users = retreivedUsers.data.docs,
        self.totPages = retreivedUsers.data.pages,
        self.totParents = retreivedUsers.data.total;
    });

  }

  goToProfile(username: string) {
    this.searchService.viewProfile(username);
  }

  getPage(event): void {

    this.currPage = event.pageIndex + 1;
    this.getCurrPage();
  }

  getCurrPage(): void {
    this.searchService.getParents(this.tags, this.currPage, this.numberPerPage
    ).subscribe(function (retreivedUsers) {
      this.users = retreivedUsers.data.docs,
        this.totPages = retreivedUsers.data.pages,
        this.totParents = retreivedUsers.data.total;
    });
  }

  ngOnInit() {
    this.currPage = 1;
    this.tags = ['NA', 'NA', 'NA', 'NA'];
    this.users = [];
    this.removable = true;
    this.getCurrPage();
  }

}
