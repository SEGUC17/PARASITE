import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService, Toast } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const self = this;
    this.activatedRoute.params.subscribe(function (params) {
      self.authService.verifyChildEmail(params['id']).subscribe(function (res) {
        if (res.msg) {
          if (self.translate.currentLang === 'en') {
            self.toastrService.success(res.msg);
          } else {
            self.toastrService.success('تم توثيق الحساب');
          }
        }
        self.router.navigateByUrl('/content/list');
      });
    });
  }

}
