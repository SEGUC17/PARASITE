import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContentModule } from './content/content.module';
import { MessagingModule } from './messaging/messaging.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { ActivitiesModule } from './activities/activities.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PsychologistModule } from './psychologist/psychologist.module';
import { AuthService } from './auth/auth.service';

import { MarketModule } from './market/market.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogContent } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MediaMatcher } from '@angular/cdk/layout';
import { AdminModule } from './admin/admin.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChildsignupModule } from './childsignup/childsignup.module';
import { CalendarModule } from 'angular-calendar';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { MatChipsModule } from '@angular/material';
import { AuthInterceptor } from './auth-interceptor';
import { ChildsignupComponent } from './childsignup/childsignup.component';
import { MatNativeDateModule } from '@angular/material';



@NgModule({
  declarations: [
    AppComponent,
    ChildsignupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatNativeDateModule,
    FlexLayoutModule,
    DashboardModule,
    AdminModule,
    ProfileModule,
    ContentModule,
    MatDialogModule,
    MatSnackBarModule,
    AuthModule,
    ScheduleModule,
    PsychologistModule,
    MatIconModule,
    MarketModule,
    ActivitiesModule,
    MessagingModule,
    AppRoutingModule,
    ChildsignupModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    HttpClientModule,
    FormsModule,
    MatChipsModule,
    LayoutModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    AuthModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    MediaMatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
