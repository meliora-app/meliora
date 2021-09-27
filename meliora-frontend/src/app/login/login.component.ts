import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    console.log('email', form.value.email);
    console.log('pass', form.value.password);
    this.signIn(String(form.value.email), String(form.value.password));
  }

  signIn(email: string, password: string) {
    this.authService.signIn(email, password);
  }
}
