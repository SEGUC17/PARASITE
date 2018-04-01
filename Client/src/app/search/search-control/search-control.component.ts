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
   parents: User[];
   parent: string;
   tag: string;
   tags: string[];
   visible: Boolean = true;
   selectable: Boolean = true;
   removable: Boolean = true;
   addOnBlur: Boolean = true;
   sKey: string;
   currPage: number;
  numberPerPage = 10;
  totPages: number;
  numberOfParents: number;

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

  remove(tag: any): void {
    let index = this.tags.indexOf(tag);
    this.tag = '';
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }


constructor(private searchService: SearchService) {
  this.tags = [];
  this.parents = [];
  this.parent = '';
  this.tag = '';
  this.sKey = '';
}
getParents(s: string) {
  console.log('entered');
  switch (this.tag) {
    case 'username': this.searchService.getParents(this.sKey + s).subscribe(res => this.parents = res.data); break;
    case 'educationLevels': this.searchService.searchByEducationLevel(this.sKey + s).subscribe(res => this.parents = res.data); break;
    case 'educationSystems': this.searchService.searchByEducationSystems(this.sKey + s).subscribe(res => this.parents = res.data); break;

  }
  // this.getNumberOfPages();


}
saveInfo(searchKey: string) {
this.sKey = searchKey;
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
      res => this.numberOfParents = res.data.numberOfPages,
      res => this.parents

    );
}

ngOnInit() {
  this.currPage = 1;
  this.tag = 'username';
}

}
