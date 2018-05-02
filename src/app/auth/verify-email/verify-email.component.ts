import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService, Toast } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const self = this;
    this.activatedRoute.params.subscribe(function (params) {
      self.authService.verifyEmail(params['id']).subscribe(function (res) {
        if (res.msg === 'Email Verification Is Successful!') {
          self.authService.setToken(res.token);
          self.translate.get('AUTH.TOASTER.EMAIL_VERIFICATION').subscribe(
            function (translation) {
              self.toastrService.success(translation);
            });
        }
        self.router.navigateByUrl('/content/list');
      });
    });
  }

}
