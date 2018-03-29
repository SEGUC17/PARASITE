import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  hb: any;
  source: any;
  constructor() {

    this.themeService.getJsTheme().subscribe(theme => {
      var colors = theme.variables;
      this.hb = {
        class: 'btn-hero-success',
        default: {
          gradientLeft: `adjust-hue(${colors.success}, 20deg)`,
          gradientRight: colors.success,
        },
        cosmic: {
          gradientLeft: `adjust-hue(${colors.success}, 20deg)`,
          gradientRight: colors.success,
          bevel: `shade(${colors.success}, 14%)`,
          shadow: 'rgba (33, 7, 77, 0.5)',
          glow: `adjust-hue(${colors.success}, 10deg)`,
        }
      }
    });
}

  ngOnInit() {
  }

}
