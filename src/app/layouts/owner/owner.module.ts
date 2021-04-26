import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerComponent } from './owner.component';
import { DashboardComponent } from 'src/app/pages/owner/dashboard/dashboard.component';
import { MaterialModule } from 'src/app/angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillComponent } from 'src/app/pages/owner/bill/bill.component';
import { IncomeComponent } from 'src/app/pages/owner/income/income.component';
import { LeaseAgreementComponent } from 'src/app/pages/owner/lease-agreement/lease-agreement.component';
import { RoomComponent } from 'src/app/pages/owner/room/room.component';
import { UserDataComponent } from 'src/app/pages/owner/user-data/user-data.component';
import { BlogPostComponent } from 'src/app/pages/owner/blog-post/blog-post.component';

@NgModule({
  declarations: [
    OwnerComponent,
    DashboardComponent,
    UserDataComponent,
    LeaseAgreementComponent,
    RoomComponent,
    BillComponent,
    IncomeComponent,
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgImageFullscreenViewModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
})
export class OwnerModule { }
