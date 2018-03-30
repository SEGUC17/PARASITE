import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
//import { MatFormFieldControl} from '@angular/material';
import{MatFormFieldModule, MatButtonModule} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
//herer;jdhdbvjxj



// import { QuillEditorModule } from 'ngx-quill-editor';
// import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
   
    CommonModule,
    MarketRoutingModule,
    RouterModule,
    MatInputModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    

    // ,
    // FlexLayoutModule,
     FormsModule
    // QuillEditorModule
  ],
  declarations: [MarketComponent, CreateProductComponent]
})
export class MarketModule { }
