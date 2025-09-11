import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/auth/login/login.component';
import { RegisterComponent } from './core/components/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

import { CompanyComponent } from './core/components/admin/company/company.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { DashboardHomeComponent } from './core/components/dashboard-home-component/dashboard-home-component';
import { ForbiddenComponent } from './core/components/forbidden-component/forbidden-component';
import { UsersComponent } from './core/components/admin/users-component/users-component';
import { RolesComponent } from './core/components/admin/roles-component/roles-component';
import { ClaimsComponent } from './core/components/admin/claims-component/claims-component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Manager'] },
    children: [
      { path: '', component: DashboardHomeComponent },

      // Company
      { path: 'company', component: CompanyComponent, canActivate: [authGuard], data: { permissions: ['ManageCompany.View'] } },

      // Users
      { path: 'users', component: UsersComponent, canActivate: [authGuard], data: { permissions: ['ManageUsers.View'] } },

      // Roles
      { path: 'roles', component: RolesComponent, canActivate: [authGuard], data: { permissions: ['ManageRoles.View'] } },

      // Claims
      { path: 'claims', component: ClaimsComponent, canActivate: [authGuard], data: { permissions: ['ManageRoles.View'] } },
    ]
  },

  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: 'login' }
];
