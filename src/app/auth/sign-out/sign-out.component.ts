import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    const self = this;
    this.authService.setToken(null);
    self.translate.get('AUTH.TOASTER.SIGN_OUT_SUCCESSFULL').subscribe(
      function (translation) {
        self.toastrService.success(translation);
      }
    );
    this.router.navigateByUrl('/content/list');
  }

}
