import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

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
    loadChildren: 'app/activities/activities.module#ActivitiesModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
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
    loadChildren: 'app/market/market.module#MarketModule'
  },
  {
    path: 'message',
    loadChildren: 'app/messaging/messaging.module#MessagingModule'
  },
  {
    path: 'profile',
    loadChildren: 'app/profile/profile.module#ProfileModule'
  },
  {
    path: 'psychologist',
    loadChildren: 'app/psychologist/psychologist.module#PsychologistModule'
  },
  {
    path: 'search',
    loadChildren: 'app/search/search.module#SearchModule'
  },
  {
    path: 'newsfeed',
    loadChildren: 'app/newsfeed/newsfeed.module#NewsfeedModule'
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
