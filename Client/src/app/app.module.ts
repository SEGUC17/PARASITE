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
import { MarketModule } from './market/market.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    ProfileModule,
    ContentModule,
    AuthModule,
    ScheduleModule,
    PsychologistModule,
    MarketModule,
    ActivitiesModule,
    MessagingModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
