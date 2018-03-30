import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
//import { MatFormFieldControl} from '@angular/material';


// import { FormsModule } from '@angular/forms';
// import { QuillEditorModule } from 'ngx-quill-editor';
// import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    //MatFormFieldControl,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,

    // ,
    // FlexLayoutModule,
     FormsModule
    // QuillEditorModule
  ],
  declarations: [MarketComponent, CreateProductComponent, ProductDetailComponent]
})
export class MarketModule { }
