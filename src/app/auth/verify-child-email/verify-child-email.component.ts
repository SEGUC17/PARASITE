import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService, Toast } from 'ngx-toastr';

@Component({
  selector: 'app-verify-child-email',
  templateUrl: './verify-child-email.component.html',
  styleUrls: ['./verify-child-email.component.scss']
})
export class VerifyChildEmailComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    const self = this;
    this.activatedRoute.params.subscribe(function (params) {
      self.authService.verifyChildEmail(params['id']).subscribe(function (res) {
        if (res.msg) {
          self.toastrService.success(res.msg);
        }
        self.router.navigate(['/']);
      });
    });
  }

}
