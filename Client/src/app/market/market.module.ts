import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { MarketRoutingModule } from './market-routing.module';

@NgModule({
  imports: [
    MarketRoutingModule
  ],
  declarations: [MarketComponent]
})
export class MarketModule { }
