import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../Product';
import { MarketService } from '../market.service';
import { AuthService } from '../../auth/auth.service';
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
  user: any;
  constructor(private marketService: MarketService, private authService: AuthService,
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.oldData = data.product;
    this.product = data.product;

  }


  editPrice() {
    let self = this;
    const userDataColumns = ['username'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
    });
    if (this.toggleEditForm) {
      // let newprice = this.formInput.price;
      const req = {
        _id: this.product._id,
        acquiringType: this.product.acquiringType,
        createdAt: this.product.createdAt,
        description: this.product.description,
        image: this.product.image,
        name: this.product.name,
        price: this.formInput.price,
        rentPeriod: this.product.rentPeriod,
        seller: this.product.seller
      };
      this.marketService.editPrice(req, self.user.username).subscribe(function (res) {
        self.toggleEditForm = false;
        if (res.err == null) {
        }
      });
      self.dialogRef.close();
    } else {
      self.toggleEditForm = true;
      self.formInput = self.oldData;
    }
  }



}
