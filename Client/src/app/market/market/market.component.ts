import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
declare const $: any;
declare const swal: any;
declare const ionRangeSlider: any;

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
  userRequests: Product[];
  seller = 'all';
  sort: string;
  filter = 'name';
  sorts = [
    'latest',
    'cheapest'
  ];
  sellers = [
    'all',
    'me'
  ];
  constructor(public dialog: MatDialog, public router: Router,
    private marketService: MarketService, private authService: AuthService, @Inject(DOCUMENT) private document: Document) { }

  // initializes the current pages in the market and user item
  // gets the products in the market and the products owned by the user)
  ngOnInit() {

    $('#range_02').ionRangeSlider({
      min: 100,
      max: 1000,
      from: 550
  });

    const self = this;
    const userDataColumns = ['username', 'isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (!self.user) {
        self.router.navigate(['/']);
      } else {
        self.currentPageNumber = 1;
        self.firstPage();
        self.getUserRequests();
      }
    });
  }
  showConfirmMessage(): void {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: true
    }, function (isConfirm) {
      if (isConfirm) {
        swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
      }
    });
  }
  showFilter(option: string) {
    this.filter = option;
  }

  // opens the product details dialog
  showProductDetails(prod: any): void {
    if (prod) {
      if (this.products.indexOf(prod) !== -1) {
        let dialogRef = this.dialog.open(ProductDetailComponent, {
          width: '80%',
          maxHeight: '80%',
          data: { product: prod, curUser: this.user.username, isAdmin: this.user.isAdmin }
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
    //  width: '75%',
    //  height: '60%',
      data: { market: self }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      self.getUserRequests();
      self.firstPage();
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

  applySeller(x: string): void {
    let self = this;
    self.seller = x;
    if (x === 'all') {
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
      self.selectedPrice = undefined;
      self.writtenPrice = undefined;
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

  getUserRequests(): void {
    let self = this;
    this.marketService.getUserRequests(this.user.username).subscribe(function (res) {
      if (res.msg === 'Requests retrieved.') {
        self.userRequests = res.data;
      }
    });
  }
}
