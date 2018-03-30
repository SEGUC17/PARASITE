import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchControlComponent } from './search-control/search-control.component';
import { SearchRoutingModule } from './search-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  declarations: [SearchControlComponent]
})
export class SearchModule { }
