import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { LayoutModule } from '@angular/cdk/layout';
import { PsychologistComponent } from './psychologist/psychologist.component';
import { AddPsychRequestComponent } from './add-psych-request/add-psych-request.component';
import { PsychologistRoutingModule } from './psychologist-routing.module';
import { MatChipsModule } from '@angular/material';
import { PsychologistService } from './psychologist.service';
import { MatButtonModule } from '@angular/material';
import { EditPsychComponent } from './edit-psych/edit-psych.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    //
    MatDialogModule,
    //
    LayoutModule,
    PsychologistRoutingModule
  ],
  providers: [ PsychologistService, { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, ErrorStateMatcher ],
  declarations: [PsychologistComponent, AddPsychRequestComponent, EditPsychComponent]
})
export class PsychologistModule { }
