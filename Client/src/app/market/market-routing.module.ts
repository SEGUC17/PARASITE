import { NgModule } from '@angular/core';
import {CreateProductComponent} from './create-product/create-product.component';
import { RouterModule, Routes } from '@angular/router';
import { MarketComponent } from './market/market.component';
const routes = [
  { path: 'market', component: MarketComponent },
  {path: 'market/createProduct', component: CreateProductComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class MarketRoutingModule { }
