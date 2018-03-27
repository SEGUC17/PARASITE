import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsychologistComponent } from './psychologist/psychologist.component';
import { PsychologistRoutingModule } from './psychologist-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PsychologistRoutingModule
  ],
  declarations: [PsychologistComponent]
})
export class PsychologistModule { }
