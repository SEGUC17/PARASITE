import { Component, OnInit } from '@angular/core';
import { AddPsychRequestService} from '../add-psych-request.service';
@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.css']
})
export class PsychologistComponent implements OnInit {
  psychologists: any[];
  constructor(private psychologistService: AddPsychRequestService) { }
  getPsychologists(): void {
    let self = this;
    self.psychologistService.getPsychologists().subscribe(function (psychs) {
      self.psychologists = psychs.data;
    });
  }
  ngOnInit() {
    this.getPsychologists();
  }

}
