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
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

  user: any;
  products: Product[] = [];
  currentPageNumber: number;
  entriesPerPage = 15;
  selectedName: String;
  selectedPrice;
  selectedSeller;
  writtenPrice;
  writtenName;
  numberOfProducts: number;
  numberOfUserProducts: number;
  userItems: Product[];
  userItemsCurrentPage: number;
  removable = true;
  seller = 'all';
  sort: string;
  sorts = [
    'latest',
    'cheapest'
  ];
  constructor(public dialog: MatDialog, public router: Router,
    private marketService: MarketService, private authService: AuthService, @Inject(DOCUMENT) private document: Document) { }

  // initializes the current pages in the market and user item
  // gets the products in the market and the products owned by the user)
  ngOnInit() {
    const self = this;
    const userDataColumns = ['username'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (!self.user) {
        self.router.navigate(['/']);
      } else {
        self.userItemsCurrentPage = 1;
        self.currentPageNumber = 1;
        self.firstPage();
        self.firstUserPage();
      }
    });
  }
  // opens the product details dialog
  showProductDetails(prod: any): void {
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
    });
  }

  // gets the content of the current market page from the market service (DB)
  // restrict the products to the ones following the delimiters given
  getPage(): void {
    const self = this;
    if (self.selectedName) {
      self.selectedName = self.selectedName.trim();
    }
    const limiters = {
      price: self.selectedPrice + 1,
      name: self.selectedName,
      seller: self.selectedSeller,
      sort: self.sort
    };
    self.marketService.getMarketPage(self.entriesPerPage,
      self.currentPageNumber, limiters)
      .subscribe(function (products) {
        self.products = self.products.concat(products.data.docs);
      });
  }

  // gets the totals number of products to be shown later
  // gets the current page products
  // restrict the products to the ones following the delimiters given
  firstPage(): void {
    const self = this;
    self.currentPageNumber = 1;
    self.products = [];
    self.getPage();
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
  applySeller(x: number): void {
    let self = this;
    if (x === 0) {
      self.selectedSeller = null;
    } else {
      self.selectedSeller = this.user.username;
    }
    self.firstPage();
  }
  applyPrice(): void {
    let self = this;
    self.selectedPrice = self.writtenPrice;
    self.firstPage();
  }
  applyName(): void {
    let self = this;
    self.selectedName = self.writtenName;
    self.firstPage();
  }
  applySort(x: string): void {
    let self = this;
    self.sort = x;
    self.firstPage();
  }
  remove(toRemove: string): void {
    let self = this;
    if (toRemove === 'seller') {
      self.selectedSeller = null;
      self.seller = 'all';
    } else if (toRemove === 'price') {
      self.selectedPrice = null;
      self.writtenPrice = null;
    } else if (toRemove === 'name') {
      self.selectedName = null;
      self.writtenName = null;
    } else {
      self.sort = null;
    }
    self.firstPage();
  }

  onScroll(): void {
    this.currentPageNumber += 1;
    this.getPage();
  }

  onPaginateChangeMyItems(event): void {
    this.userItemsCurrentPage = event.pageIndex + 1;
    this.getUserPage();
  }

}
