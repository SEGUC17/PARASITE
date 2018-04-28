import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component..scss']
})
export class ActivityEditComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ActivityEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { } // Edit activity dialog


  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close(); // closing dialog
  }

}
