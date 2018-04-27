import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
    this.authService.setToken(null);
    this.toastrService.success('Sign Out Is Successful!');
    this.router.navigate(['/']);
  }

}
