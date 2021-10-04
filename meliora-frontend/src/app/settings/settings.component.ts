import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  displayConfirmBox = false;
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    console.log('Inside submit form');
    this.darkModeCheck(form.value.darkmode);
  }

  async darkModeCheck(darkmode: string) {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/signup',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          darkmode,
        }),
      }
    );

    if (res.status == 200) {
      let resBody = await res.json();
      localStorage.setItem('darkModeStatus', resBody.darkModeStatus);
    } else {
      let resBody = await res.json();
      console.log(resBody);
    }
  }

  changePasswordEmail(): void {
    console.log('Inside Change Password');
    this.authService.changePasswordEmail();
  }

  deleteFunction() {}
}
