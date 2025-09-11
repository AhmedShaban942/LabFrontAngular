import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { UserService } from '../../../services/user/user.service';
import { AppRole } from '../../../models/Role/AppRole';
import { BaseComponent } from '../../BaseComponent';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './roles-component.html',
  styleUrl: './roles-component.css'
})
export class RolesComponent extends BaseComponent implements OnInit {
  private userService = inject(UserService);
  private translate = inject(TranslateService);

  roles = signal<AppRole[]>([]);
  selectedRole = signal<AppRole | null>(null);

 override  ngOnInit(): void {
    super.ngOnInit();
    this.initializePermissions('ManageRoles'); // ⚡ الصلاحيات الخاصة بالـ Roles
    this.loadRoles();
    this.translate.use(this.translate.currentLang);
  }

  loadRoles() {
    this.userService.getRoles().subscribe(res => {
      if(res.succeeded) this.roles.set(res.data);
    });
  }

  addRole() {
    this.selectedRole.set({ id: '', name: '' });
  }

  selectRole(role: AppRole) {
    this.selectedRole.set({ ...role });
  }

  saveRole() {
    const role = this.selectedRole();
    if (!role) return;

    const obs = role.id
      ? this.userService.updateRole(role)
      : this.userService.createRole(role);

    obs.subscribe(res => {
      if(res.succeeded) {
        this.loadRoles();
        this.selectedRole.set(null);
      }
    });
  }

  deleteRole(id: string) {
    if (!confirm(this.translate.instant('ROLES.CONFIRM_DELETE'))) return;
    this.userService.deleteRole(id).subscribe(res => {
      if(res.succeeded) this.loadRoles();
    });
  }
}
