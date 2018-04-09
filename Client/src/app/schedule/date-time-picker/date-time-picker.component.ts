import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  getSeconds,
  getMinutes,
  getHours,
  getDate,
  getMonth,
  getYear,
  setSeconds,
  setMinutes,
  setHours,
  setDate,
  setMonth,
  setYear
} from 'date-fns';

export const DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimePickerComponent),
  multi: true
};

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR, DatePipe]
})
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() placeholder: string;
  @Input() time: String;

  date: Date;

  picker: MatDatepicker<Date>;

  private onChangeCallback: (date: Date) => void = () => { };

  constructor(private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }

  writeValue(date: Date): void {
    this.date = date;
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void { }

  update(): void {
    let newTime = this.time.split(':');
    let hours = +newTime[0];
    let minutes = +newTime[1];
    const newDate: Date = setHours(
      setMinutes(
        this.date,
        minutes
      ),
      hours
    );
    this.writeValue(newDate);
    this.onChangeCallback(newDate);
  }
}
