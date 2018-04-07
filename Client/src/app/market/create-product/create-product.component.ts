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
  user: any;

  createProduct(product: any) {

    this.user = this.authService.getUser(); //here i get the currently logged in user

    let pro = { //here i put the inputs i take and place them in pro
      name: this.formInput.name,
      price: this.formInput.price,
      seller: this.user.username,
      image: this.formInput.imageURL,
      acquiringType: this.formInput.acquiringType,
      rentPeriod: this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date,
    };
    console.log(pro); // print pro in console, to check if the input taken correctly 

    let error = false;// a boolean to check if there is an error
    
//if condition to check that the user did put in all the required inputs <some inputs weren't necessary which is why i didn't include them>
    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) === '' 
      || ((<HTMLInputElement>document.getElementById('description')).value) === ''
      || ((<HTMLInputElement>document.getElementById('price')).value) === ''
      || ((<HTMLInputElement>document.getElementById('name')).value) === '') {
      error = true; 
    }

    if (!error) { // enter the if condition if there is no error = all required inputs are there
      // there are two cases, the user is an admin => the product will be created , the user is not an admin => will create a productrequst 
      if (this.user.isAdmin === true) { // if user = admin
        let self = this;
        this.marketService.createProduct(pro).subscribe(function (res) { //create product using the <pro> that have the inputs given by the user 
          if (res.msg === 'Product was created successfully.') {
// if the response mssge was <Product was created successfully> then insert it in the market page
            self.data.market.firstPage();
            self.data.market.firstUserPage();
            self.dialogRef.close();// close the dialog = it is the form that the creatproduct is in
          }
        });
      } 
      else {// else the user is not an admin
        let self = this;
        this.marketService.createProductRequest(pro).subscribe(function (res) { // call the createProductRequest from the backend
          if (res.msg === 'ProductRequest was created successfully.') {
         // if the response mssge was <ProductRequest was created successfully>
            self.dialogRef.close(); // close the dialog form
          }
        });
      }
    } else { //not a createProduct was send nor a creatProductRequest was made then that mean that something went wrong, which is that the user didn't insert all the required inputs
      alert('REQUEST FAILED: Please make sure you have all data written');
    }
  }
}



