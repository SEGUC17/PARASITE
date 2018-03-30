import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PsychologistComponent } from './psychologist/psychologist.component';
import { AddPsychRequestComponent } from './add-psych-request/add-psych-request.component';
import { PsychologistRoutingModule } from './psychologist-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PsychologistRoutingModule
  ],
  declarations: [PsychologistComponent, AddPsychRequestComponent]
})
export class PsychologistModule { }
