import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-redirector',
  templateUrl: './content-redirector.component.html',
  styleUrls: ['./content-redirector.component.scss']
})
export class ContentRedirectorComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) {
      const self = this;
    this.route.params.subscribe(function (params) {
      self.router.navigateByUrl('content/view/' + params.id);
    });
  }

  ngOnInit() {
  }

}
