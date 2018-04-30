import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { ChildernComponent } from './profile/childern/childern.component';
import { MatTabsModule, MatButtonModule, MatMenuModule,
  MatChipsModule, MatCardModule, MatExpansionModule,
  MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../messaging/messaging.service';
import { SharedModule } from '../shared/shared.module';
import { DirectMessagingComponent } from './profile/direct-messaging/direct-messaging.component';

@NgModule({
  imports: [
    ProfileRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatChipsModule,
    FormsModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    SharedModule,
    CommonModule
  ],
  declarations: [ProfileComponent, ChildernComponent, DirectMessagingComponent],
  providers: [
    ProfileService, ToastrService, MessageService
  ]
})
export class ProfileModule { }
