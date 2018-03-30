import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CreateProductService} from './create-product.service';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  constructor( private CreateProductService: CreateProductService ) { } //do i need a route here?
  ngOnInit() { }
  
  formInput = <any>{};
 
  createProductRequest(product: any){
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
    var self = this;
    this.CreateProductService.createProductRequest(req).subscribe(function (res) {
      alert("request was sent");

    });
  }
  
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
  }
  
//send request

   
 }
}


