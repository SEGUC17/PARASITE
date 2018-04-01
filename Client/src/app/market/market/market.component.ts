import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { PageEvent } from '@angular/material';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Product } from '../Product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  user: any = {
    _id: '7ad1'
  };
  products: Product[];
  currentPageNumber: number;
  entriesPerPage = 15;
  selectedName: String = 'NA';
  selectedPrice = -1;
  numberOfProducts: number;
  numberOfUserProducts: number;
  userItems: Product[];
  userItemsCurrentPage: number;

  constructor(public dialog: MatDialog, public router: Router,
    private marketService: MarketService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/']);
    }
    this.userItemsCurrentPage = 1;
    this.currentPageNumber = 1;
    this.firstPage();
  }
  openDialog(prod: any): void {
    if (prod) {
      let dialogRef = this.dialog.open(ProductDetailComponent, {
        width: '1000px',
        height: '400px',
        data: { product: prod }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

  }

  getPage(): void {
    const self = this;
    const limiters = {
      price: self.selectedPrice + 1,
      name: self.selectedName
    };
    self.marketService.getMarketPage(self.entriesPerPage,
      self.currentPageNumber, limiters)
      .subscribe(function (products) {
        self.products = products.data.docs;
      });
  }

  firstPage(): void {
    const self = this;
    const limiters = {
      price: self.selectedPrice + 1,
      name: self.selectedName
    };
    this.marketService.numberOfMarketPages(limiters)
      .subscribe(function (numberOfProducts) {
        self.numberOfProducts = numberOfProducts.data;
        console.log(numberOfProducts.data);
        self.getPage();
      });
  }
  firstUserPage(): void {
    const self = this;
    const limiters = {
      seller: self.user._id
    };
    this.marketService.numberOfMarketPages(limiters)
      .subscribe(function (numberOfProducts) {
        self.numberOfUserProducts = numberOfProducts.data;
        self.getUserPage();
      });
  }
  getUserPage(): void {
    const self = this;
    const limiters = {
      seller: self.user._id
    };
    self.marketService.getMarketPage(self.entriesPerPage,
      self.userItemsCurrentPage, limiters)
      .subscribe(function (products) {
        self.userItems = products.data.docs;
      });
  }
  clearLimits(): void {
    this.selectedName = 'NA';
    this.selectedPrice = -1;
    this.firstPage();
  }
  tabChanged(event): void {
    if (event.tab.textLabel === 'My items' && !this.userItems) {
      this.firstUserPage();
    }
  }
  onPaginateChange(event): void {
    if (event.tab.textLabel === 'My items') {
      this.userItemsCurrentPage = event.pageIndex + 1;
      this.getUserPage();
    } else {
      this.currentPageNumber = event.pageIndex + 1;
      this.getPage();
    }
  }
}
