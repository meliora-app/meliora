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
  darkModeStatus = localStorage.getItem("darkModeStatus");
  userID = localStorage.getItem("userID");
  email: string;
  phone: string;
  dateOfBirth: string;
  sex: string;
  name: string;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  async loadSettings() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUserProfile',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: this.userID
        }),
      }
    );
    if (res.status == 200) {
      let resBody = await res.json();
      this.email = resBody.email;
      this.phone = resBody.phone;
      this.dateOfBirth = resBody.dateOfBirth;
      this.sex = resBody.sex;
      this.name = resBody.name;
    }
  }
  async onLogoutClicked() {
    await this.authService.logout();
    localStorage.removeItem('userID');
    localStorage.removeItem('darkModeStatus');
  }

  onSubmit(form: NgForm) {
    console.log('Inside submit form');
    this.darkModeCheck(form.value.darkmode);
  }

  async darkModeCheck(darkmode: boolean) {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/login',
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
      localStorage.setItem('darkModeStatus', '' + darkmode);
    } else {
      let resBody = await res.json();
      console.log(resBody);
    }
  }

  changePasswordEmail(): void {
    console.log('Inside Change Password');
    this.authService.passwordResetInsideApp();
  }

  deleteFunction() {}
}
