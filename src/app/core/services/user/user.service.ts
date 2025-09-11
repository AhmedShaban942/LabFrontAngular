import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppUser } from '../../models/User/AppUser';
import { AppRole } from '../../models/Role/AppRole';
import { Claim } from '../../models/Role/Claim';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  // Users
  getAllUsers(): Observable<ApiResponse<AppUser[]>> {
    return this.http.get<ApiResponse<AppUser[]>>(`${environment.apiBase}/api/Users/GetAll`);
  }

  getUser(id: string): Observable<ApiResponse<AppUser>> {
    return this.http.get<ApiResponse<AppUser>>(`${environment.apiBase}/api/Users/Get/${id}`);
  }

  createUser(user: AppUser): Observable<ApiResponse<AppUser>> {
    return this.http.post<ApiResponse<AppUser>>(`${environment.apiBase}/api/Users/Create`, user);
  }

  updateUser(id: string, user: AppUser): Observable<ApiResponse<AppUser>> {
    return this.http.put<ApiResponse<AppUser>>(`${environment.apiBase}/api/Users/Update/${id}`, user);
  }

  deleteUser(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${environment.apiBase}/api/Users/Delete/${id}`);
  }

  // Roles
  getRoles(): Observable<ApiResponse<AppRole[]>> {
    return this.http.get<ApiResponse<AppRole[]>>(`${environment.apiBase}/api/Role/GetAll`);
  }

  createRole(role: AppRole): Observable<ApiResponse<AppRole>> {
    return this.http.post<ApiResponse<AppRole>>(`${environment.apiBase}/api/Role/Create`, role);
  }

  updateRole(role: AppRole): Observable<ApiResponse<AppRole>> {
    return this.http.put<ApiResponse<AppRole>>(`${environment.apiBase}/api/Role/Update`, role);
  }

  deleteRole(roleId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${environment.apiBase}/api/Role/Delete/${roleId}`);
  }

  // Claims
  manageClaims(roleId: string, claims: Claim[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiBase}/api/Role/ManageClaims/${roleId}`, claims);
  }

  getClaims(roleId: string): Observable<ApiResponse<Claim[]>> {
    return this.http.get<ApiResponse<Claim[]>>(`${environment.apiBase}/api/Role/ManageClaims/${roleId}`);
  }

assignRoleToUser(userId: string, roleIds: string[]): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(
    `${environment.apiBase}/api/Role/AssignRoleToUser`,
    { userId, roleIds }
  );
}
}
