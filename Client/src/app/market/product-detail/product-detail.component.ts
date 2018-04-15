import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../Product';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {

  product: Product;
  toggleEditForm = false;
  updatedFields = new Set();
  x = [];
  formInput = <any>{};
  oldData = <any>{};
  newData = <any>{};

  constructor( private marketService: MarketService, public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.oldData = data.product;
    console.log(this.oldData);
    this.product = data.product;

  }


  editPrice() {
    if (this.toggleEditForm) {
      let newprice = this.formInput.price;
      this.marketService.editPrice(newprice).subscribe(function (res) {

        console.log('hiiiiii');
        console.log(this.oldData);


        this.toggleEditForm = false;

        if (res.err == null) {
          console.log(res.err);
        }

      });
    } else {
      this.toggleEditForm = true;
      this.formInput = this.oldData;
    }
  }

  // addToUpdatedFields(event: any) {
  //   this.updatedFields.add(event.target.id);
  // }


}
