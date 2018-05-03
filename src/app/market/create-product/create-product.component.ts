import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { CreateProductRequest } from './createProductRequest';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarketComponent } from '../market/market.component';
import { AuthService } from '../../auth/auth.service';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { CloudinaryCredentials } from '../../variables';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
declare const $: any;

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})

export class CreateProductComponent {

  constructor(private marketService: MarketService, private toasterService: ToastrService, private authService: AuthService,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public translate: TranslateService) {

    const userDataColumns = ['username', 'isAdmin']; // The two attributes we need from the current user
    let self = this;
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      if (res.msg === 'Data Retrieval Is Successful!') {
        self.user = res.data;
      }
    });
  }

  productrequest: CreateProductRequest;
  formInput = <any>{};
  user: any = {};
  img: string;

  createProduct(product: any) {

    // this.user = this.authService.getUser(); // here i get the currently logged in user

    let error = false; // Check if there is an error

    // Some inputs are a must and can't be empty
    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) === ''
      || ((<HTMLInputElement>document.getElementById('description')).value) === ''
      || ((<HTMLInputElement>document.getElementById('price')).value) === ''
      || ((<HTMLInputElement>document.getElementById('name')).value) === '') {
      error = true;
    }

    if (!error) { // enter the if condition if there is no error
      let pro = { // here i put the inputs i take and place them in pro
        name: this.formInput.name,
        price: this.formInput.price,
        seller: this.user.username,
        image: this.img,
        //  this.formInput.imageURL,
        acquiringType: this.formInput.acquiringType,
        rentPeriod: this.formInput.rentPeriod,
        description: this.formInput.description,
        createdAt: new Date(),
      };
      // there are two cases
      if (this.user.isAdmin === true) { // If the user is an admin, then the product will be created
        let self = this;
        this.marketService.createProduct(pro).subscribe(function (res) {
          // Create product using <pro>
          if (res.msg === 'Product was created successfully.') {// If the creation was successful, then put that product in market
            self.data.market.firstPage();
            self.data.market.firstUserPage();
            self.dialogRef.close(); // Close the dialog form
          }
        });
      } else {// If the user is not an admin, then a product request will be created
        let self = this;
        this.marketService.createProductRequest(pro).subscribe(function (res) {
          // Create product request
          if (res.msg === 'ProductRequest was created successfully.') {// If the product request was created successfully
            self.dialogRef.close(); // Close the dialog form
          }
        });
      }
    } else {
      // If error then send an alert message
      let self = this;
      self.toasterService.error('Please make sure you have all data written', 'failure');
    }
  }


  //         image uploader          //
  uploaded(url: string) {
    let self = this;
    if (url === 'imageFailedToUpload' || url === 'noFileToUpload') {
      self.toasterService.error('image upload failed, try another image', 'failure');
    } else {
      self.img = url;
    }
  }

}

