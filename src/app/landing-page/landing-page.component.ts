import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LandingService } from '../landing.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

  constructor(public translate: TranslateService, private landingService: LandingService) { }

  ngOnInit() {
    this.landingService.setLandingView(true);
  }

  switchLang() {
    if (this.translate.currentLang === 'en') {
      this.translate.use('ara');
    } else {
      this.translate.use('en');
    }
    window.scrollTo(0, 0);
  }
  ngOnDestroy() {
    this.landingService.setLandingView(false);
  }

}
