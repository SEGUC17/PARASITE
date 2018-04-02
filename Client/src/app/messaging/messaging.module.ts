import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from './messaging.service';
import { AuthService } from '../auth/auth.service';

@NgModule({
  providers: [MessageService, AuthService],
  imports: [
    MessagingRoutingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [MessagingComponent]
})
export class MessagingModule { }

