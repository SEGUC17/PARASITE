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
declare const $: any;
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})

export class CreateProductComponent {

  constructor(private marketService: MarketService, private authService: AuthService,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

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
  tmpImg: string;
  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({ cloudName: CloudinaryCredentials.cloudName, uploadPreset: CloudinaryCredentials.uploadPreset })
  );
  loading: any;


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
      this.upload();
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
      alert('REQUEST FAILED: Please make sure you have all data written');
    }
  }


  //         image uploader          //



  upload(): any {
    let self = this;
    this.loading = true;
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (
      item: any,
      response: string,
      status: number,
      headers: any): any => {
      let res: any = JSON.parse(response);
      self.img = res.url;
    };
    this.uploader.onErrorItem =
      function (fileItem, response, status, headers) {
        // bad image
      };
  }

}

