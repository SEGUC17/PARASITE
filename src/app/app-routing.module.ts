import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes = [
  {
    path: '',
    component: AppComponent
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
    path: 'contact-us',
    component: ContactUsComponent
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
    path: 'scheduling',
    loadChildren: 'app/scheduling/scheduling.module#SchedulingModule'
  },
  {
    path: 'search',
    loadChildren: 'app/search/search.module#SearchModule'
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: 'full'
  }
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
