import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { User } from '../user';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
@Component({
  selector: 'app-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.css']
})
export class SearchControlComponent implements OnInit {
   users: User[];
   tag: string;
   tags: string[];
   chips: string[];
  visible: Boolean = true;
   selectable: Boolean = true;
   removable: Boolean = true;
   addOnBlur: Boolean = true;
   sKey: string;
   currPage: number;
  numberPerPage = 10;
  totPages: number;
  numberOfParents: number;
  flag: Boolean = false;
  selectedUsername: string;
  eduL: string;
  eduS: string;


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
  addTag(s: string): void {
    this.tag = s;
  }

  remove(tab: string): void {
    switch (tab) {
    case 'user': this.tags[0] = ''; break;
    case 'eduL': this.tags[1] = ''; break;
    case 'eduS': this.tags[2] = ''; break;
    }
  }


constructor(private searchService: SearchService) {
  this.tags = ['', '', ''];
  this.users = [];
  this.tag = '';

}
getParents(tab: String) {

  switch (tab) {
    case 'user': this.searchService.getParents(this.selectedUsername).subscribe(
      res => res.status !== 404 ?  this.users = res.data : console.log('No Such User'));
      this.tags[0] = this.selectedUsername;
       break;
    case 'eduL': this.searchService.searchByEducationLevel( this.eduL).subscribe(res => this.users = res.data);
    this.tags[1] = this.eduL;
    break;
    case 'eduS': this.searchService.searchByEducationSystems( this.eduS).subscribe(res => this.users = res.data);
    this.tags[2] = this.eduS;
    break;

  }

}

getParentsBytag(tag: string) {
  this.tag = tag;
  this.tags = [tag];
}
goToProfile(username: string) {
this.searchService.viewProfile(username);
}

getPage(event: any): void {
  let page = 1;
    if ( event ) {
      page = event.pageIndex + 1;
    }
    this.searchService.getPage(page).subscribe(
      res => this.users = res.data

    );
}

ngOnInit() {
  this.currPage = 1;
  this.tag = 'username';
}

}
