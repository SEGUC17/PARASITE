import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingRoutingModule } from './messaging-routing.module';
import { FormsModule } from '@angular/forms';
import { MessageService } from './messaging.service';

@NgModule({
  providers: [MessageService],
  imports: [
    MessagingRoutingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [MessagingComponent]
})
export class MessagingModule { }

