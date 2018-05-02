import { Injectable } from '@angular/core';

@Injectable()
export class LandingService {

  constructor() { }
  viewLanding = true;
  setLandingView(value: boolean) {
    this.viewLanding = value;
  }

  getLandingView() {
    return this.viewLanding;
  }
}
