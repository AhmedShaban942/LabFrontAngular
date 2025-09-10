import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; // ✅ إضافة الترجمة
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/login/login-request.model';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService); // ✅
  private languageService = inject(LanguageService);
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitted = false;
  loading = false;
  error: string | null = null;
  returnUrl = '/';

  get f() { return this.form.controls; }



ngOnInit() {
  this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  this.languageService.useLang(this.languageService.getCurrentLang());
}


  onSubmit() {
    this.submitted = true;
    this.error = null;

    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.value as LoginRequest).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.auth.handleAuthSuccess(res);
        } else {
          this.error = res.message || this.translate.instant('LOGIN.ERROR');
        }
      },
      error: (err) => {
        this.error = err?.error?.message || this.translate.instant('LOGIN.ERROR');
      },
      complete: () => (this.loading = false),
    });
  }
}
