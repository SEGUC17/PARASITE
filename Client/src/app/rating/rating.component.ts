import { Component, OnInit } from '@angular/core';
import { RatingService } from '../rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component..scss']
})
export class RatingComponent implements OnInit {

  constructor(private ratingService: RatingService) { }

  ngOnInit() {
  }

}
