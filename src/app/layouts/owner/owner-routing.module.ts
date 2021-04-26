import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillComponent } from 'src/app/pages/owner/bill/bill.component';
import { BlogPostComponent } from 'src/app/pages/owner/blog-post/blog-post.component';
import { DashboardComponent } from 'src/app/pages/owner/dashboard/dashboard.component';
import { IncomeComponent } from 'src/app/pages/owner/income/income.component';
import { LeaseAgreementComponent } from 'src/app/pages/owner/lease-agreement/lease-agreement.component';
import { RoomComponent } from 'src/app/pages/owner/room/room.component';
import { UserDataComponent } from 'src/app/pages/owner/user-data/user-data.component';
import { OwnerComponent } from './owner.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'user-data', component: UserDataComponent },
      { path: 'lease-agreement', component: LeaseAgreementComponent },
      { path: 'room', component: RoomComponent },
      { path: 'bill', component: BillComponent },
      { path: 'income', component: IncomeComponent },
      { path: 'blog-post', component: BlogPostComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
