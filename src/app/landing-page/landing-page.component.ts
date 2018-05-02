import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  switchLang() {
    if (this.translate.currentLang === 'en') {
      this.translate.use('ara');
    } else {
      this.translate.use('en');
    }
  }

}
