import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { User } from '../user';
@Component({
  selector: 'app-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.css']
})
export class SearchControlComponent implements OnInit {
   parents: User[];
   parent:string;

constructor(private searchService: SearchService) {
}
getParents(username:string){

    this.searchService.getParents(username).subscribe(res=>this.parents = res.data);

}
getParentsBytag(tag:string){
  switch(tag){
    case 'educationLevels':this.searchService.searchByEducationLevel(tag).subscribe(res=>this.parents = res.data);
    case 'educationSystems':this.searchService.searchByEducationSystems(tag).subscribe(res=>this.parents = res.data);

  }
}

ngOnInit() {
}

}
