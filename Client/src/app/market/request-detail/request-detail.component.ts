import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent {

  toggleEditForm = false;
  updatedFields = new Set();
  formInput = <any>{};
  oldData = <any>{};
  newData = <any>{};

  constructor(private marketService: MarketService, public dialogRef: MatDialogRef<RequestDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.oldData = data.product;
    this.formInput.image = data.product.image;
    console.log(this.oldData);
  }

  toggleForm() {
    if (this.toggleEditForm) {
      let self = this;
      this.updatedFields.forEach(function (field: String) {
        self.newData['' + field] = self.formInput['' + field];
      });
      if (this.newData.acquiringType === 'sell') {
        delete this.newData.rentPeriod;
        delete this.formInput.rentPeriod;
        delete this.oldData.rentPeriod;
      }
      console.log(this.newData);
      this.marketService.updateRequest(this.newData, this.oldData._id, this.oldData.seller).subscribe(function (res) {
        if (res.err) {
          console.log('Something went wrong');
        } else {
          console.log('Success');
          let _this = self;
          Object.keys(self.newData).forEach(function (field: String) {
            _this.oldData['' + field] = _this.newData['' + field];
          });
          self.toggleEditForm = false;
        }
      });
    } else {
      this.toggleEditForm = true;
      this.formInput = this.oldData;
    }
  }

  cancelEdits() {
    this.toggleEditForm = false;
  }

  addToUpdatedFields(event: any) {
    this.updatedFields.add(event.target.id);
  }
}
