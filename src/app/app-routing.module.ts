import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { GuestGuard } from './shared/guard/guest.guard';
import { OwnerGuard } from './shared/guard/owner.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    canActivate: [AuthGuard],
    component: LoginComponent
  },
  {
    path: 'auth/register',
    canActivate: [AuthGuard],
    component: RegisterComponent
  },
  {
    path: 'guest',
    canActivate: [GuestGuard],
    loadChildren: () => import('./layouts/guest/guest.module').then(m => m.GuestModule)
  },
  {
    path: 'owner',
    canActivate: [OwnerGuard],
    loadChildren: () => import('./layouts/owner/owner.module').then(m => m.OwnerModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
