import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppUser } from '../../../models/User/AppUser';
import { AppRole } from '../../../models/Role/AppRole';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user/user.service';
import { BaseComponent } from '../../BaseComponent';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './users-component.html',
  styleUrls: ['./users-component.css']
})
export class UsersComponent extends BaseComponent implements OnInit {
  private userService = inject(UserService);
  private translate = inject(TranslateService);

  users = signal<AppUser[]>([]);
  selectedUser = signal<AppUser | null>(null);
  allRoles = signal<AppRole[]>([]);

  override ngOnInit(): void {
    super.initializePermissions('ManageUsers');
    this.loadUsers();
    this.loadRoles();
    this.translate.use(this.translate.currentLang);
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: res => { if(res.succeeded) this.users.set(res.data); }
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: res => { if(res.succeeded) this.allRoles.set(res.data); }
    });
  }

  addUser() {
    this.selectedUser.set({ id: '', userName: '', email: '', fullName: '', roles: [] });
  }

  selectUser(user: AppUser) {
    this.selectedUser.set({ ...user });
  }

  saveUser() {
    const user = this.selectedUser();
    if (!user) return;

    const obs = user.id
      ? this.userService.updateUser(user.id, user)
      : this.userService.createUser(user);

    obs.subscribe(res => {
      if(res.succeeded) {
        this.loadUsers();
        this.selectedUser.set(null);
      }
    });
  }


  deleteUser(id: string) {
  if (!confirm(this.translate.instant('USERS.CONFIRM_DELETE'))) return;
  this.userService.deleteUser(id).subscribe(res => {
    if(res.succeeded) this.loadUsers();
  });
}


  // إدارة الأدوار المتعددة
  assignRoleToUser(user: AppUser, roleId: string) {
    if (!roleId || user.roles.includes(roleId)) return;
    const roleIds = [...user.roles, roleId]; // إضافة الدور الجديد
    this.userService.assignRoleToUser(user.id, roleIds).subscribe(res => {
      if(res.succeeded) this.loadUsers();
    });
  }

  removeRoleFromUser(user: AppUser, roleId: string) {
    const roleIds = user.roles.filter(r => r !== roleId); // إزالة الدور
    this.userService.assignRoleToUser(user.id, roleIds).subscribe(res => {
      if(res.succeeded) this.loadUsers();
    });
  }

  onRoleSelect(user: AppUser, event: Event) {
    const select = event.target as HTMLSelectElement;
    const roleId = select.value;
    this.assignRoleToUser(user, roleId);
  }

}
