import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FeatureGuardService } from './feature-guard.service';
import { AdminGuardService } from './admin-guard.service';

const routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingPageComponent
  },
  {
    path: 'activities',
    loadChildren: 'app/activities/activities.module#ActivitiesModule',
    canLoad: [FeatureGuardService]
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AdminGuardService]
  },
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  },
  {
    path: 'content',
    loadChildren: 'app/content/content.module#ContentModule'
  },
  {
    path: 'market',
    loadChildren: 'app/market/market.module#MarketModule',
    canLoad: [FeatureGuardService]
  },
  {
    path: 'message',
    loadChildren: 'app/messaging/messaging.module#MessagingModule',
    canLoad: [FeatureGuardService]
  },
  {
    path: 'profile',
    loadChildren: 'app/profile/profile.module#ProfileModule',
    canLoad: [FeatureGuardService]
  },
  {
    path: 'psychologist',
    loadChildren: 'app/psychologist/psychologist.module#PsychologistModule'
  },
  {
    path: 'search',
    loadChildren: 'app/search/search.module#SearchModule',
    canLoad: [FeatureGuardService]
  },
  {
    path: 'newsfeed',
    loadChildren: 'app/newsfeed/newsfeed.module#NewsfeedModule',
    canLoad: [FeatureGuardService]
  }, {
    path: 'scheduling',
    loadChildren: 'app/scheduling/scheduling.module#SchedulingModule',
    canLoad: [FeatureGuardService]
  },
  {
    path: '**',
    redirectTo: '/landing',
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
