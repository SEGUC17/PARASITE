import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { createProductRequest } from './createProductRequest';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  constructor(private MarketService: MarketService) { } //do i need a route here?
  ngOnInit() {
    console.log('entered create');
   }
  productrequest: createProductRequest;

  formInput = <any>{};

  createProductRequest(product: any) { //should the paramerters be empty
    var user = { //their fns are under development, so used as a variable
      name: user,
      isAdmin: false,
    }
    //  var userr = getUser
    var pro = {
      name: this.formInput.name,
      price: this.formInput.price,
      seller: user.name,//......................incorrect, please check 
      image: this.formInput.imageURL,
      acquiringType: this.formInput.acquiringType,
      rentPeriod: this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date,
    };
    


    var error = false;

    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) == ""
      || ((<HTMLInputElement>document.getElementById('description')).value) === ""
      // || ((<HTMLInputElement>document.getElementById("rentPeriod")).value) == ""
      || ((<HTMLInputElement>document.getElementById('price')).value) === ""
      || ((<HTMLInputElement>document.getElementById('pic')).value) == ""
      || ((<HTMLInputElement>document.getElementById('name')).value) === "") {
        
      error = true;
    

    }
    // if((typeof pro.price != 'number')) {
    //   console.log("incorrect");
    //   error=true
    // }
    if (!error) {
      var productrequest = this.productrequest;
      // var self = this;
      this.MarketService.createProductRequest(pro).subscribe(function (res) {
        alert("request was sent");

      });
    } else {
      alert("REQUEST FAILED: Please make sure you have all data written");
    }
   
  }

  createProduct(product: any) {
    var user = { //their fns are under development, so used as a variable
      name: 'ahmed',
      isAdmin: false,
    }

    var pro = {
      name: this.formInput.name,
      price: this.formInput.price,
      seller: user.name,//......................incorrect, please check 
      image: this.formInput.imageURL,
      acquiringType: this.formInput.acquiringType,
      rentPeriod: this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date,
    };
    console.log(pro);

    var error = false;

    if (((<HTMLInputElement>document.getElementById('acquiringType')).value) == ""
      || ((<HTMLInputElement>document.getElementById('description')).value) === ""
      // || ((<HTMLInputElement>document.getElementById("rentPeriod")).value) == ""
      || ((<HTMLInputElement>document.getElementById('price')).value) === ""
      || ((<HTMLInputElement>document.getElementById('pic')).value) == ""
      || ((<HTMLInputElement>document.getElementById('name')).value) === "") {
      error = true;
    }
    if (!error) {
      if (user.isAdmin == true) {
        var self = this;
        this.MarketService.createProduct(pro).subscribe(function (res) {
          alert("Product created");

        });
      }
      else {
        var self = this;
        this.MarketService.createProductRequest(pro).subscribe(function (res) {
          console.log(res.data);
          alert("request was sent");
        });
      }
    } else {
      alert("REQUEST FAILED: Please make sure you have all data written");
    }
  }





  
}


