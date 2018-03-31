import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MessagingRoutingModule,
    FormsModule
  ],
  declarations: [MessagingComponent]
})
export class MessagingModule { }
