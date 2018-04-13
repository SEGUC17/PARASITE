import { Component, OnInit } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatSnackBar } from '@angular/material';
import { EditePsychComponent } from '../edite-psych/edite-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.css']
})
export class PsychologistComponent implements OnInit {

  psychologists: any[];

  constructor(private psychologistService: PsychologistService,public dialog: MatDialog, public router: Router,
               public snackBar: MatSnackBar) { }

  getPsychologists(): void {
    let self = this;
    self.psychologistService.getPsychologists().subscribe(function (psychs) {
      self.psychologists = psychs.data;
    });
  }
  deletePsychologist(index: any): void {
    const self = this;
    this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function(res) {
      if (res.err != null) {
        /* if an error returned notify the user to try again */
        self.snackBar.open('Something went wrong, please try again.', '', {
          duration: 2500
        });
      } else {
        /* everything went great!! notify the user it was a success then reload. */
        self.snackBar.open(res.msg, '', {
          duration: 2300
        });
        self.getPsychologists();
      }
    });
  }
  goToEdite() {
    const self = this;
    let dialogRef = self.dialog.open(EditePsychComponent, {
      width: '850px',
      height: '550px',
      data: { market: self }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit() {
    this.getPsychologists();
  }

}
