import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RegisterData } from '../../../models/register/register-data.model';
import { ApiResponse } from '../../../models/api-response.model';
import { RegisterRequest } from '../../../models/register/register-request.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-register',
    standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
imports: [FormsModule,CommonModule],
})
export class RegisterComponent {
  form: RegisterRequest = {
    userName: '',
    email: '',
    password: '',
    fullName: ''
  };

  message = '';
  errors: string[] = [];

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.form).subscribe({
      next: (res: ApiResponse<RegisterData>) => {
        if (res.succeeded) {
          this.authService.handleAuthSuccess(res);
          this.message = '✅ تم التسجيل بنجاح';
          this.errors = [];
        } else {
          this.message = res.message || '❌ فشل التسجيل';
          this.errors = res.errors || [];
        }
      },
      error: (err) => {
        this.message = '⚠️ خطأ في الاتصال بالسيرفر';
        console.error(err);
      }
    });
  }
}
