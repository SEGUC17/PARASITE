import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { PsychologistComponent } from './psychologist/psychologist.component';
import { AddPsychRequestComponent } from './add-psych-request/add-psych-request.component';
import { PsychologistRoutingModule } from './psychologist-routing.module';
import { PsychologistService } from './psychologist.service';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { EditPsychComponent } from './edit-psych/edit-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    InfiniteScrollModule,
    MatDialogModule,
    LayoutModule,
    PsychologistRoutingModule,
    TranslateModule.forChild()
  ],
  providers: [ PsychologistService, { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] } ],
  declarations: [PsychologistComponent, AddPsychRequestComponent, EditPsychComponent]
})
export class PsychologistModule { }
