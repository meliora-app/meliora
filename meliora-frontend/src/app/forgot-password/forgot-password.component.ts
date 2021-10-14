import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {}

  async onSubmit(form: NgForm) {
    await this.authService.passwordResetEmail(form.value.email);
    this.router.navigate(['/login']);
    this.toast.showSuccessMessage(
      'Password Reset Email sent',
      'Reset Password'
    );
  }
}
