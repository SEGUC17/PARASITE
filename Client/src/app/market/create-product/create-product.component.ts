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

  constructor(private marketService: MarketService, private authService: AuthService,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const userDataColumns = ['username', 'isAdmin'];
    let self = this;
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      if (res.msg === 'Data Retrieval Is Successful!') {
        console.log('Got here');
        self.user = res.data;
        console.log(self.user);
      }
    });

  }

  productrequest: createProductRequest;
  formInput = <any>{};
  user: any = {};

  createProduct(product: any) {

    let pro = { // here i put the inputs i take and place them in pro
      name: this.formInput.name,
      price: this.formInput.price,
      seller: this.user.username,
      image: this.formInput.imageURL,
      acquiringType: this.formInput.acquiringType,
      rentPeriod: this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date,
    };
    console.log(pro); //to check if the input taken correctly

    let error = false; //check if there is an error

    // some inputs are a must have and can't be empty
    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) === ''
      || ((<HTMLInputElement>document.getElementById('description')).value) === ''
      || ((<HTMLInputElement>document.getElementById('price')).value) === ''
      || ((<HTMLInputElement>document.getElementById('name')).value) === '') {
      error = true;
    }

    if (!error) { // enter the if condition if there is no error
      // there are two cases
      if (this.user.isAdmin === true) { //user is an admin => the product will be created
        let self = this;
        this.marketService.createProduct(pro).subscribe(function (res) {
          // create product using <pro>
          if (res.msg === 'Product was created successfully.') {//create a product
            self.data.market.firstPage();
            self.data.market.firstUserPage();
            self.dialogRef.close(); // close the dialog 
          }
        });
      } else {// user is not an admin => will create a productrequst 
        let self = this;
        this.marketService.createProductRequest(pro).subscribe(function (res) { //create product request
          if (res.msg === 'ProductRequest was created successfully.') {
            self.dialogRef.close(); // close the dialog form
          }
        });
      }
    } else {
      // not a createProduct was send nor a creatProductRequest was made then that mean that something went wrong,
      // which is that the user didn't insert all the required inputs
      alert('REQUEST FAILED: Please make sure you have all data written');
    }
  }
}

