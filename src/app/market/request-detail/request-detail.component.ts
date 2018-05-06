import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MarketService } from '../market.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent {

  // This boolean toggles between editing the data and showing it
  toggleEditForm = false;
  // This stores names of the fields that the user changed
  updatedFields = new Set();
  // Arrays for the attributes of the request in the different states of the component
  formInput = <any>{};
  oldData = <any>{};
  newData = <any>{};

  constructor(private marketService: MarketService, public dialogRef: MatDialogRef<RequestDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private notify: ToastrService, public translate: TranslateService) {
    // Store the old data of the product
    this.oldData = data.product;
    // Set the image of the form
    this.formInput.image = data.product.image;
  }

  toggleForm() {
    // Check what was the old state of the component
    if (this.toggleEditForm) {
      // If it was a form and it's being submitted
      let self = this;
      // Go through the updated fields and add them to the new data
      this.updatedFields.forEach(function (field: String) {
        self.newData['' + field] = self.formInput['' + field];
      });

      // If a product is not being rent anymore, remove the rent data
      if (this.newData.acquiringType === 'sell') {
        delete this.newData.rentPeriod;
        delete this.formInput.rentPeriod;
        delete this.oldData.rentPeriod;
      }

      // Sent the HTTP request
      this.marketService.updateRequest(this.newData, this.oldData._id, this.oldData.seller).subscribe(function (res) {
        if (res.err) {
          // If an error was received, show the error
          self.notify.error(res.err);
        } else {
          // Otherwise, notify, and update the request data on the view
          self.notify.success(res.msg);
          let _this = self;
          Object.keys(self.newData).forEach(function (field: String) {
            _this.oldData['' + field] = _this.newData['' + field];
          });
          self.toggleEditForm = false;
        }
      });
    } else {
      // Else, show the form for editing and set the default values as the old data
      let self = this;
      this.toggleEditForm = true;
      let fields = ['name', 'price', 'acquiringType', 'description', 'rentPeriod'];
      for (let field of fields) {
        self.formInput['' + field] = self.oldData['' + field];
      }
    }
  }

  cancelEdits() {
    // Ignore the edits and close the form
    this.toggleEditForm = false;
  }

  addToUpdatedFields(event: any) {
    // Add the changed form input field to the array of changed fields
    this.updatedFields.add(event.target.id);
  }
}
