import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login/login-request.model';
import { LoginData } from '../models/login/login-data.model';
import { RegisterRequest } from '../models/register/register-request.model';
import { RegisterData } from '../models/register/register-data.model';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';
import { Observable, of, catchError, map, tap, switchMap, throwError } from 'rxjs';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(this.getStoredToken());
  private _user = signal<LoginData | RegisterData | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  // 🔹 Login
  login(payload: LoginRequest) {
    const url = `${environment.apiBase}/api/auth/login`;
    return this.http.post<ApiResponse<LoginData>>(url, payload);
  }

  // 🔹 Register
  register(payload: RegisterRequest) {
    const url = `${environment.apiBase}/api/auth/register`;
    return this.http.post<ApiResponse<RegisterData>>(url, payload);
  }

  // 🔹 Handle Login/Register Success
  handleAuthSuccess(res: ApiResponse<LoginData | RegisterData>) {
    if (res.succeeded && res.data?.token) {
      const d = res.data;
      this.storeAuthData(d);
      this.router.navigate(['/admin']);
    }
  }

  // 🔹 Logout
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  // 🔹 Check if token expired
  isTokenExpired(): boolean {
    const d = this._user();
    if (!d || !d.tokenExpires) return true;
    return new Date(d.tokenExpires) <= new Date();
  }

  // 🔹 Refresh Token
refreshToken(): Observable<boolean> {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) {
    this.logout();
    return of(false);
  }

  const url = `${environment.apiBase}/api/auth/refresh-token`;
  const body = { refreshToken: refresh }; // 👈 هذا هو التعديل المهم

  return this.http.post<ApiResponse<LoginData | RegisterData>>(url, body).pipe(
    tap(res => {
      if (res.succeeded && res.data?.token) {
        this.storeAuthData(res.data);
      } else {
        this.logout();
      }
    }),
    map(res => res.succeeded),
    catchError(() => {
      this.logout();
      return of(false);
    })
  );
}
  // 🔹 Helper to store auth data
  private storeAuthData(data: LoginData | RegisterData) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    this._token.set(data.token);
    this._user.set(data);
  }

  // 🔹 Token getter
  token(): string | null {
    return this._token();
  }

  // 🔹 User getter
  user(): LoginData | RegisterData | null {
    return this._user();
  }

  // 🔹 Roles getter
  roles(): string[] {
    return this._user()?.roles || [];
  }

  isAuthenticated(): boolean {
    const d = this._user();
    if (!d) return false;
    return new Date(d.tokenExpires) > new Date();
  }

  // 🔹 Private helpers
  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): LoginData | RegisterData | null {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
}
