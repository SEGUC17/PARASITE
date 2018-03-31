import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import{MatFormFieldModule, MatButtonModule} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import {CreateProductService} from './create-product/create-product.service'

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
    FormsModule
   
  ],
  providers: [CreateProductService],
  declarations: [MarketComponent, CreateProductComponent]
})
export class MarketModule { }
