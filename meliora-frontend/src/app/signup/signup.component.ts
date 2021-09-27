import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(public authService: AuthService) {}

  title = 'My Variable';

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.signUp(form.value.email, form.value.password);
  }

  async signUp(email: string, password: string) {
    await this.authService.signUp(email, password);
  }
}
