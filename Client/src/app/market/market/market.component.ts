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
  entriesPerPage = 16;
  totalNumberOfPages = 0;
  selectedName: String;
  selectedPrice;
  selectedSeller;
  writtenPrice;
  writtenName;
  userRequests: Product[];

  sort: string;
  filter = 'Name';
  constructor(public dialog: MatDialog, public router: Router,
    private marketService: MarketService, private authService: AuthService, @Inject(DOCUMENT) private document: Document) { }

  // initializes the current pages in the market and user item
  // gets the products in the market and the products owned by the user)
  ngOnInit() {
    $(function () {
      // Taken from http://ionden.com/a/plugins/ion.rangeSlider/demo.html

      $('#range').ionRangeSlider({
        min: 100,
        max: 1000,
        from: 550
      });
    });
    // get logged in user info
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

  //        start of market page actions       //

  // sets the current page to the first page
  // gets the current page products
  firstPage(): void {
    const self = this;
    self.currentPageNumber = 1;
    self.products = [];
    self.getPage();
  }

  // gets the content of the current market page from the market service (DB)
  // restrict the products to the ones following the delimiters given
  getPage(): void {
    // scroll to the top
    window.scrollTo(0, 0);

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
        self.totalNumberOfPages = products.data.pages;
        console.log(self.totalNumberOfPages);
        self.products = products.data.docs;
      });
  }

  //        end of market page actions       //


  //        start of my requests page actions       //

  // get the requests submitted by the user
  getUserRequests(): void {
    let self = this;
    this.marketService.getUserRequests(this.user.username).subscribe(function (res) {
      if (res.msg === 'Requests retrieved.') {
        self.userRequests = res.data;
      }
    });
  }

  //        end of my requests page actions       //


  // opens the product details dialog
  showProductDetails(prod: any): void {
    if (prod) {
      if (this.products.indexOf(prod) !== -1) {
        let dialogRef = this.dialog.open(ProductDetailComponent, {
          width: '1000px',
          height: '400px',
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
      data: { market: self }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      self.getUserRequests();
      self.firstPage();
    });
  }




  //         start of search actions         //


  // show the div related to the filter selected
  showFilter(option: string) {
    this.filter = option;
  }

  // apply delimiter based on seller
  applySeller(x: string): void {
    let self = this;
    if (x === 'all') {
      self.selectedSeller = null;
    } else {
      self.selectedSeller = this.user.username;
    }
    self.firstPage();
  }

  // apply price delimiter
  applyPrice(): void {
    let self = this;
    self.selectedPrice = self.writtenPrice;
    self.firstPage();
  }

  // apply name search delimiter
  applyName(): void {
    let self = this;
    self.selectedName = self.writtenName;
    self.firstPage();
  }

  // apply sorting delimiter
  applySort(x: string): void {
    let self = this;
    self.sort = x;
    self.firstPage();
  }

  // remove a search delimiter
  remove(toRemove: string): void {
    let self = this;
    if (toRemove === 'seller') {
      self.selectedSeller = null;
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

  //            end of search actions            //



  //         start of pagination actions         //

  // change the current page on user click on pagination
  changePage(pageNum: number): any {
    this.currentPageNumber = pageNum;
    this.getPage();
  }

  // calculate the number of pages to display in pagination
  getPaginationRange(): any {

    let pageNumbers = [];
    let counter = 1;

    if (this.currentPageNumber < 3) {
      // we are in page 1 or 2
      while (counter < 6 && counter <= this.totalNumberOfPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
      // we are in a page greater than 2
      pageNumbers.push(this.currentPageNumber - 2);
      pageNumbers.push(this.currentPageNumber - 1);
      pageNumbers.push(this.currentPageNumber);
      if (this.currentPageNumber + 1 <= this.totalNumberOfPages) {
        pageNumbers.push(this.currentPageNumber + 1);
      }
      if (this.currentPageNumber + 2 <= this.totalNumberOfPages) {
        pageNumbers.push(this.currentPageNumber + 2);
      }
    }
    return pageNumbers;
  }

  //         end of pagination actions         //

}
