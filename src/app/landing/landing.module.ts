import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingRoutingModule } from './/landing-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { FormsModule } from '@angular/forms';
import { MessageService} from '../messaging/messaging.service';
import { AuthService} from '../auth/auth.service';


@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    RouterModule,
    TranslateModule.forChild(),
    FormsModule
  ],
  declarations: [LandingPageComponent, ContactUsComponent],

  providers: [MessageService,  AuthService]
})
export class LandingModule { }
