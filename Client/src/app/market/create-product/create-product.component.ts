import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CreateProductService} from './create-product.service';
 import {createProductRequest} from './createProductRequest';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  constructor( private CreateProductService: CreateProductService ) { } //do i need a route here?
  ngOnInit() { }
  productrequest: createProductRequest;

  formInput = <any>{};
 
  createProductRequest(product: any){ //should the paramerters be empty
    var user = { //their fns are under development, so used as a variable
      name:'ahmed',
      isAdmin: true,
               }
    var pro = {
      name: this.formInput.name,
      price:this.formInput.price,
      seller: user.name,//......................incorrect, please check 
      image:this.formInput.pic,
      acquiringType:this.formInput.acquiringType,
      rentPeriod:this.formInput.rentPeriod,
      description: this.formInput.description,
      createdAt: new Date,
              };  
   var req= {
      product : [pro],
             
            }

            var error = false;

            if(((<HTMLInputElement>document.getElementById("acquiringType")).value) == "" 
              || ((<HTMLInputElement>document.getElementById("description")).value) === "" 
              // || ((<HTMLInputElement>document.getElementById("rentPeriod")).value) == ""
              || ((<HTMLInputElement>document.getElementById("price")).value) === "" 
              || ((<HTMLInputElement>document.getElementById("pic")).value) == "" 
              || ((<HTMLInputElement>document.getElementById("name")).value) === "" ){
                    error = true;
            }
            if(!error){
              var productrequest = this.productrequest;
   // var self = this;
    this.CreateProductService.createProductRequest(req).subscribe(function (res) {
      alert("request was sent");

    });
  } else {      alert("Please make sure you have all data written");
}}
  
  createProduct(product: any){
  var user = { //their fns are under development, so used as a variable
       name:'ahmed',
       isAdmin: true,
             }

  var pro = {
    name: this.formInput.name,
    price:this.formInput.price,
    seller: user.name,//......................incorrect, please check 
    image:this.formInput.pic,
    acquiringType:this.formInput.acquiringType,
    rentPeriod:this.formInput.rentPeriod,
    description: this.formInput.description,
    createdAt: new Date,
            }; 
            console.log(pro);

            var error = false;

            if(((<HTMLInputElement>document.getElementById("acquiringType")).value) == "" 
              || ((<HTMLInputElement>document.getElementById("description")).value) === "" 
              // || ((<HTMLInputElement>document.getElementById("rentPeriod")).value) == ""
              || ((<HTMLInputElement>document.getElementById("price")).value) === "" 
              || ((<HTMLInputElement>document.getElementById("pic")).value) == "" 
              || ((<HTMLInputElement>document.getElementById("name")).value) === "" ){
                    error = true;
            }
            if(!error){
  if (user.isAdmin = true){
    var self = this;
    this.CreateProductService.createProduct(pro).subscribe(function (res) {
      alert("Product created");

    });
  
  }
  
  else { 
    var self = this;
    var req= {
      product : [pro],
             }
             
    this.CreateProductService.createProductRequest(req).subscribe(function (res) {
      alert("request was sent");

    });
  }}   else {      alert("Please make sure you have all data written");
}
  

   
 }
}


