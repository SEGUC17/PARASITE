import { Component, OnInit } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { EditePsychComponent } from '../edite-psych/edite-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.scss']
})
export class PsychologistComponent implements OnInit {

  user: any;
  psychologists: any[];
  admin: boolean;

  constructor(private psychologistService: PsychologistService,
    public snackBar: MatSnackBar, public dialog: MatDialog,
    private authService: AuthService,
    private router: Router) { }
  formInput = <any>{};


  getPsychologists(): void {
    let self = this;
    self.psychologistService.getPsychologists().subscribe(function (psychs) {
      self.psychologists = psychs.data;
    });
  }
  deletePsychologist(index: any): void {
    const self = this;
    if (this.admin) {
      this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
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
    } else {
      alert('your are not an admin to do that >:(');
    }
  }
  ngOnInit() {
    const self = this;
    const userDataColumns = ['isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (!self.user) {
        self.router.navigate(['/']);
      } else {
        self.admin = self.user.isAdmin;
      }
      self.getPsychologists();
    });
  }
  goToEdite() {
    const self = this;
    let idd = {
      idd: this.formInput.idd,
    };
    //get info of idd = input??how

    let dialogRef = self.dialog.open(EditePsychComponent, {
      width: '850px',
      height: '550px',
      data: { market: self , id:idd }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}

