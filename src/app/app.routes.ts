import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/auth/login/login.component';
import { RegisterComponent } from './core/components/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

import { CompanyComponent } from './core/components/admin/company/company.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { DashboardHomeComponent } from './core/components/dashboard-home-component/dashboard-home-component';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'company', component: CompanyComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
