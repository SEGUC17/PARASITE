import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { User } from '../user';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
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
  totPages: number;
  selectedUsername: string;
  eduL: string;
  eduS: string;
  loc: string;


  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];


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
    switch (tab) {
      case 'user': this.tags[0] = 'NA'; break;
      case 'eduL': this.tags[1] = 'NA'; break;
      case 'eduS': this.tags[2] = 'NA'; break;
      case 'loc': this.tags[3] = 'NA'; break;
    }
    this.users = [];
  }


  constructor(private searchService: SearchService) {
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
    this.searchService.getParents(this.tags).subscribe(function(retreivedUsers) {
      self.users = retreivedUsers.data.docs; });

  }

  goToProfile(username: string) {
    this.searchService.viewProfile(username);
  }

  getPage(event: any): void {
    let page = 1;
    if (event) {
      page = event.pageIndex + 1;
    }
    this.searchService.getPage(page).subscribe(
      res => this.users = res.data

    );
  }

  ngOnInit() {
    this.currPage = 1;
    this.tags = ['NA', 'NA', 'NA', 'NA'];
    this.users = [];
    this.removable = true;
  }

}
