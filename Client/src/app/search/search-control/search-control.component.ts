import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../search.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.css']
})
export class SearchControlComponent implements OnInit {
   parents: string[];

constructor(private searchService: SearchService) {
}
getParents(){
    this.searchService.getParents().subscribe(res=>this.parents = res.data);
}

ngOnInit() {
}

}
