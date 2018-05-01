import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MarketService } from './market.service';
import { RouterModule, Routes } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatSliderModule,
  MatSlideToggleModule, MatIconModule, MatRadioModule, MatChipsModule
} from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { SharedModule } from '../shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MarketRoutingModule,
    MatDialogModule,
    SharedModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  providers: [ToastrService, MarketService, { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }],
  entryComponents: [MarketComponent, ProductDetailComponent, RequestDetailComponent],
  declarations: [MarketComponent, ProductDetailComponent, CreateProductComponent, RequestDetailComponent]
})
export class MarketModule { }
