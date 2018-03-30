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
   parent:string;
   tag:string;
   tags:string[];
   visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];


  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    let index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }


constructor(private searchService: SearchService) {
  this.tags = [];
}
getParents(username:string){
  switch(this.tag){
    case 'username': this.searchService.getParents(username).subscribe(res=>this.parents = res.data);
    case 'educationLevels':this.searchService.searchByEducationLevel(this.tag).subscribe(res=>this.parents = res.data);
    case 'educationSystems':this.searchService.searchByEducationSystems(this.tag).subscribe(res=>this.parents = res.data);

  }


}
getParentsBytag(tag:string){
  this.tag = tag;
  this.tags = [tag];
}

ngOnInit() {
}

}
