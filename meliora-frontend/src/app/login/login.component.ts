import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';
import { UserService } from '../shared/services/userServices/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmit(form: NgForm) {
    console.log('email', form.value.unameOrEmail);
    console.log('pass', form.value.password);
    await this.authService.signIn(
      String(form.value.unameOrEmail),
      String(form.value.password)
    );
  }

  // async signIn(email: string, password: string) {

  //   let res = await fetch(
  //     'https://meliora-backend.herokuapp.com/api/users/login',
  //     {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         username: 'xmadera2',
  //       }),
  //     }
  //   );

  //   if (res.status == 200) {
  //     let resBody = await res.json();

  //     console.log(resBody);

  //     localStorage.setItem('userID', resBody._id);
  //     localStorage.setItem('darkModeStatus', resBody.darkModeStatus);
  //   }
  // }
}
