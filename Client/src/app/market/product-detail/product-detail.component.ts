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
      //let newprice = this.formInput.price;

      const req ={
        editID: this.product._id,
        acquiringType : this.product.acquiringType,
        createdAt : this.product.createdAt,
        description : this.product.description,
        image : this.product.image,
        name : this.product.name,
        price : this.formInput.price,
        rentPeriod : this.product.rentPeriod,
        seller :  this.product.seller

      }
      this.marketService.editPrice(req).subscribe(function (res) {

         console.log(this.req);


        this.toggleEditForm = false;

        if (res.err == null) {
          console.log(res.err);
        }

      });
      this.dialogRef.close();
      console.log(req);
    } else {
      this.toggleEditForm = true;
      this.formInput = this.oldData;
    }
  }



}
