import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
