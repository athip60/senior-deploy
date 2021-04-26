import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { MaterialModule } from 'src/app/angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { RouterModule } from '@angular/router';
import { DashboardGuestComponent } from 'src/app/pages/guest/dashboard-guest/dashboard-guest.component';
import { BillGuestComponent } from 'src/app/pages/guest/bill-guest/bill-guest.component';
import { BlogPostComponent } from 'src/app/pages/guest/blog-post/blog-post.component';


@NgModule({
  declarations: [
    GuestComponent,
    DashboardGuestComponent,
    BillGuestComponent,
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgImageFullscreenViewModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class GuestModule { }
