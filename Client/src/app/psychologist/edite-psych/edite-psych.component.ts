import { Component, OnInit } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsychologistComponent } from '../psychologist/psychologist.component';



@Component({
  selector: 'app-edite-psych',
  templateUrl: './edite-psych.component.html',
  styleUrls: ['./edite-psych.component.css']
})
export class EditePsychComponent implements OnInit {
  psychologists: any[];

  constructor(private psychologistService: PsychologistService,   public dialogRef: MatDialogRef<EditePsychComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
  }
  //need to get the info 
  getPsychologists(): void {
    let self = this;
    self.psychologistService.getPsychologists().subscribe(function (psychs) {
      self.psychologists = psychs.data;
    });
  }

  editePsychologists():void{
    

  }

}
