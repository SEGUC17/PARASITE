import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketComponent } from './market/market.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
const routes = [
  { path: 'market', component: MarketComponent },
  { path: 'market/:productId', component: ProductDetailComponent}
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class MarketRoutingModule { }
