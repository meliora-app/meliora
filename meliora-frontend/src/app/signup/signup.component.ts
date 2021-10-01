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
    this.signUp(form.value.email, form.value.username, form.value.password);
  }

  async signUp(email: string, username: string, password: string) {
    await this.authService.signUp(email, password);

    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/signup', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password
      })
    });

    if (res.status == 200) {
      let resBody = await res.json();
      localStorage.setItem('userID', resBody._id);
      localStorage.setItem('darkModeStatus', 'false');
    } else {
      let resBody = await res.json();
      console.log(resBody);
    }
  }
}
