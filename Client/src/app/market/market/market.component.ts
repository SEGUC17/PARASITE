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
import { RequestDetailComponent } from '../request-detail/request-detail.component';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  user: any = {};
  products: Product[];
  currentPageNumber: number;
  entriesPerPage = 15;
  selectedName: String;
  selectedPrice;
  numberOfProducts: number;
  numberOfUserProducts: number;
  userItems: Product[];
  userRequests: Product[];
  userItemsCurrentPage: number;

  constructor(public dialog: MatDialog, public router: Router,
    private marketService: MarketService, private authService: AuthService, @Inject(DOCUMENT) private document: Document) { }

  // initializes the current pages in the market and user item
  // gets the products in the market and the products owned by the user)
  ngOnInit() {
    const self = this;
    const userDataColumns = ['username', 'isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (!self.user) {
        self.router.navigate(['/']);
      } else {
        self.userItemsCurrentPage = 1;
        self.currentPageNumber = 1;
        self.firstPage();
        self.firstUserPage();
        self.getUserRequests();
      }
    });
  }
  // opens the product details dialog
  showProductDetails(prod: any): void {
    if (prod) {
      if (this.products.indexOf(prod) !== -1 || this.userItems.indexOf(prod) !== -1) {
        let dialogRef = this.dialog.open(ProductDetailComponent, {
          width: '1000px',
          height: '400px',
          data: { product: prod, curUser: this.user.username }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      } else if (this.userRequests.indexOf(prod) !== -1) {
        let dialogRef = this.dialog.open(RequestDetailComponent, {
          width: '1000px',
          height: '400px',
          data: { product: prod, curUser: this.user.username }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
    }
  }

  // Opens the dialog form of creating a product
  goToCreate() {
    const self = this;
    let dialogRef = self.dialog.open(CreateProductComponent, {
      width: '850px',
      height: '550px',
      data: { market: self }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getUserRequests();
    });
  }

  // gets the content of the current market page from the market service (DB)
  // restrict the products to the ones following the delimiters given
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

  // gets the totals number of products to be shown later
  // gets the current page products
  // restrict the products to the ones following the delimiters given
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

  // gets the totals number of products owned by the user
  // gets the current user items page products
  // restrict the products to the ones following the delimiters given
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

  // gets the current user items page products
  // restrict the products to the ones following the delimiters given
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
  // clears search critirea
  clearLimits(): void {
    this.selectedName = undefined;
    this.selectedPrice = undefined;
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

  getUserRequests(): void {
    let self = this;
    this.marketService.getUserRequests(this.user.username).subscribe(function (res) {
      if (res.msg === 'Requests retrieved.') {
        self.userRequests = res.data;
      }
    });
  }
}
