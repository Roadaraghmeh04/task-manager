import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // تأكد مسار الخدمة

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const {username, email, password} = this.registerForm.value;

      // أولاً نسجّل المستخدم
      this.authService.register(username, email, password).subscribe({
        next: () => {
          // بعد التسجيل بنعمل login تلقائي
          this.authService.login(email, password).subscribe({
            next: () => {
              // بعد تسجيل الدخول بنروح على dashboard
              this.router.navigate(['/dashboard']);
              this.isLoading = false;
            },
            error: (err) => {
              this.errorMessage = err.error?.message || 'Login after registration failed';
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed';
          this.isLoading = false;
        }
      });
    }
  }}

