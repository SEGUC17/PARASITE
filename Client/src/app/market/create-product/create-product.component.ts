import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { createProductRequest } from './createProductRequest';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarketComponent } from '../market/market.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})

export class CreateProductComponent {

  constructor(private marketService: MarketService, private authService: AuthService ,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  productrequest: createProductRequest;
  formInput = <any>{};

  createProduct(product: any) {
    let user = this.authService.getUser();

    let pro = {
      name: this.formInput.name,
      price: this.formInput.price,
      seller: user._id,
      image: this.formInput.imageURL,
      acquiringType: this.formInput.acquiringType,
      rentPeriod: this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date,
    };
    console.log(pro);

    let error = false;

    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) === ''
      || ((<HTMLInputElement>document.getElementById('description')).value) === ''
      // || ((<HTMLInputElement>document.getElementById('rentPeriod')).value) === ''
      || ((<HTMLInputElement>document.getElementById('price')).value) === ''
      //   || ((<HTMLInputElement>document.getElementById('imageUrl')).value) === ''
      || ((<HTMLInputElement>document.getElementById('name')).value) === '') {
      error = true;
    }

    if (!error) {
      if (user.isAdmin === true) {
        let self = this;
        this.marketService.createProduct(pro).subscribe(function (res) {
          if (res.msg === 'Product was created successfully.') {
            alert('Product added successfully');
            this.data.market.getPage();
            this.data.market.getUserPage();
            self.dialogRef.close();
          }
        });
      } else {
        let self = this;
        this.marketService.createProductRequest(pro).subscribe(function (res) {
          if (res.msg === 'ProductRequest was created successfully.') {
            alert('Request sent successfully');
            self.dialogRef.close();
          }
        });
      }
    } else {
      alert('REQUEST FAILED: Please make sure you have all data written');
    }
  }
}



