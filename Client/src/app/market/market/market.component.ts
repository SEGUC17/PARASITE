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
import { CreateProductComponent } from '../create-product/create-product.component';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  user: any;
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
    private marketService: MarketService, private authService: AuthService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    const self = this;
    self.user = self.authService.getUser();
    if (!self.user) {
      self.router.navigate(['/']);
    }
        console.log(self.user);
    self.userItemsCurrentPage = 1;
    self.currentPageNumber = 1;
    self.firstPage();
    self.firstUserPage();
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

  goToCreate() {
    const self = this;
    let dialogRef = self.dialog.open(CreateProductComponent, {
      width: '850px',
      height: '550px',
      data: { market: self}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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
      seller: self.user.username
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
      seller: self.user.username
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
  onPaginateChangeMarket(event): void {
      this.currentPageNumber = event.pageIndex + 1;
      this.getPage();
  }
  onPaginateChangeMyItems(event): void {
    this.userItemsCurrentPage = event.pageIndex + 1;
      this.getUserPage();
  }
}
