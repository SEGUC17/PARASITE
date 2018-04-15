import { Component, OnInit, Input } from '@angular/core';
import { RatingService } from '../../rating.service';
import { UserRating } from './rating';
import { ClickEvent, RatingChangeEvent } from 'angular-star-rating';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component..scss']
})
export class RatingComponent implements OnInit {
  // type of objects to be rated can only be
  // one of the three following types
  @Input() type: 'content' | 'studyPlan' | 'product';
  // the ID of the object that you are rating.
  @Input() ratedID: string;
  // input rating in the form of numbers
  @Input() rating: number;
  public userRating: UserRating;
  public disabled = false;
  private init = true;
  constructor(private ratingService: RatingService) { }

  ngOnInit() {
    this.userRating = {
      type: this.type,
      ratedID: this.ratedID,
      rating: this.rating
    };
  }

  onRatingChange($event: RatingChangeEvent) {
    // in case of rating change on component init, don't change anything.
    if (this.init) {
      this.init = false;
      return;
    }
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
      self.disabled = true;
      self.userRating.rating = res.data;
    });
  }
}
