import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthInterceptor } from './auth-interceptor';
import { RatingService } from './rating.service';
import { SharedModule } from './shared/shared.module';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FacebookModule } from 'ngx-facebook';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { MessageService } from './messaging/messaging.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    HttpClientModule,
    FormsModule,
    LayoutModule,
    CommonModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      maxOpened: 3
    }),
    FacebookModule.forRoot()
  ],
  providers: [
    AuthService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    RatingService,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
