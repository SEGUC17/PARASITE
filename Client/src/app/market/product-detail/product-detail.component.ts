import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Product } from '../Product';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {

  product : Product;
  toggleEditForm = false;
  updatedFields = new Set();
  x = [];
  formInput = <any>{};
  oldData = <any>{};
  newData = <any>{};

  constructor(public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
this.oldData = data.product;
    console.log(this.oldData);
      this.product = data.product;

    }

    
    editPrice() {
      if (this.toggleEditForm) {
        let self = this;
        this.updatedFields.forEach(function (field: String) {
          self.newData['' + field] = self.formInput['' + field];
        });
        // if (this.newData.acquiringType === 'sell') {
        //   delete this.newData.rentPeriod;
        //   delete this.formInput.rentPeriod;
        //   delete this.oldData.rentPeriod;
        // }
        console.log(this.newData);
        // Sent HTTP here
        this.toggleEditForm = false;
      } else {
        this.toggleEditForm = true;
        this.formInput = this.oldData;
      }
    }
  
    // addToUpdatedFields(event: any) {
    //   this.updatedFields.add(event.target.id);
    // }

   
}
