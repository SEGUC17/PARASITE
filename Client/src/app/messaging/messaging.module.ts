import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';

@NgModule({
  imports: [
    MessagingRoutingModule
  ],
  declarations: [MessagingComponent]
})
export class MessagingModule { }
