import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { createProductRequest } from './createProductRequest';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {

  constructor(private marketService: MarketService, public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  productrequest: createProductRequest;
  formInput = <any>{};
  createProductRequest(product: any) {
    let user = {
      _id: String,
      isAdmin: false,
    };
    let pro = {
      name: this.formInput.name,
      price: this.formInput.price,
      seller: user._id,
      image: this.formInput.imageURL,
      acquiringType: this.formInput.acquiringType,
      rentPeriod: this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date(),
    };
    let error = false;

    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) === ''
      || ((<HTMLInputElement>document.getElementById('description')).value) === ''
      // || ((<HTMLInputElement>document.getElementById('rentPeriod')).value) === ''
      || ((<HTMLInputElement>document.getElementById('price')).value) === ''
    //  || ((<HTMLInputElement>document.getElementById('imageUrl')).value) === ''
      || ((<HTMLInputElement>document.getElementById('name')).value) === '') {
      error = true;
    }
    // if((typeof pro.price != 'number')) {
    //   console.log('incorrect');
    //   error=true
    // }
    if (!error) {
      let productrequest = this.productrequest;
      // let self = this;
      this.marketService.createProductRequest(pro).subscribe(function (res) {
        alert('request was sent');

      });
    } else {
      alert('REQUEST FAILED: Please make sure you have all data written');
    }
  }

  createProduct(product: any) {
    let user = {
      _id: 'ahmed',
      isAdmin: true,
    };

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
          alert('Product added successfully');
          self.dialogRef.close();
        });
      } else {
        let self = this;
        this.marketService.createProductRequest(pro).subscribe(function (res) {
          alert('Request sent successfully');
          self.dialogRef.close();
        });
      }
    } else {
      alert('REQUEST FAILED: Please make sure you have all data written');
    }
  }
}



