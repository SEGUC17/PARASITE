import { Component, OnInit, Input } from '@angular/core';
import { RatingService } from '../../rating.service';
import { UserRating } from './rating';
import { ClickEvent, RatingChangeEvent } from 'angular-star-rating';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  // type of objects to be rated can only be
  // one of the three following types
  @Input() type: 'content' | 'studyPlan' | 'seller';
  // the ID of the object that you are rating.
  @Input() ratedId: string;
  // input rating in the form of numbers
  @Input() inputRating: number;
  public userRating: UserRating;
  public disabled = false;
  public objectRating;
  constructor(private ratingService: RatingService) { }

  ngOnInit() {
    this.objectRating = this.inputRating;
    this.userRating = {
      type: this.type,
      ratedId: this.ratedId,
      rating: 0
    };
  }

  onClick($event: ClickEvent) {
    // in case of rating change on component init, don't change anything.
    // in case of updates coming back from the server, don't resend a request
    this.userRating.rating = $event.rating;
    this.addRating();
  }

  addRating() {
    const self = this;
    // disable clicking on the rating component until you get a response from the server
    self.disabled = true;
    this.ratingService.rate(this.userRating).subscribe(function (res) {
      if (!res) {
        return;
      }
      // Re-enable clicking after rating is updated
      self.disabled = false;
      self.objectRating = res.data;
    });
  }
}
