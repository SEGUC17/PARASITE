import { Injectable } from '@angular/core';

@Injectable()
export class LandingService {

  constructor() { }
  viewLanding = false;
  setLandingView(value: boolean) {
    this.viewLanding = value;
  }

  getLandingView() {
    return this.viewLanding;
  }
}
