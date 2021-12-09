import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleModule } from '@angular/material/button-toggle';

export class Settings {
  username: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  sex: string;
  darkModeStatus: boolean;
  private: boolean;
  notificationPreference: number;

  constructor(
    username: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    sex: string,
    darkModeStatus: boolean,
    notificationPreference: number
  ) {
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.sex = sex;
    this.darkModeStatus = darkModeStatus;
    this.notificationPreference = notificationPreference;
  }
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  displayConfirmBox = false;
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  userID = localStorage.getItem('userID');
  settings: Settings;
  private: boolean = true;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  async loadSettings() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: this.userID,
        }),
      }
    );
    if (res.status == 200) {
      let resBody = await res.json();
      this.private = resBody.private;
      this.settings = new Settings(
        resBody.username,
        resBody.email,
        resBody.phone,
        resBody.dateOfBirth,
        resBody.sex,
        resBody.darkModeStatus,
        resBody.notificationPreference
      );
      var notificationOptions = <HTMLSelectElement> document.getElementById("notificationOptions");
      notificationOptions.value = this.settings.notificationPreference.toString();
    }
  }
  async onLogoutClicked() {
    await this.authService.logout();
    localStorage.removeItem('userID');
    localStorage.removeItem('darkModeStatus');
  }

  async onSubmit(form: NgForm) {
    console.log('Inside submit form');
    console.log('checked?: ' + this.settings.darkModeStatus);
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/updateSettings',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: this.userID,
          phone: this.settings.phone,
          dateOfBirth: this.settings.dateOfBirth,
          darkModeStatus: localStorage.getItem('darkModeStatus'),
          notificationPreference: this.settings.notificationPreference
        }),
      }
    );
    if (res.status == 200) {
      // on successful update
    }
  }

  checkDarkMode(event: any) {
    console.log(event.target.checked);
    localStorage.setItem('darkModeStatus', '' + event.target.checked);
    this.darkModeStatus = event.target.checked;
    this.settings.darkModeStatus = event.target.checked;
  }

  /*
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
  */

  changePasswordEmail(): void {
    console.log('Inside Change Password');
    this.authService.passwordResetInsideApp();
  }

  async onDeleteAccountClicked() {
    if (confirm('Are you sure you want to delete your account?')) {
      await this.authService.deleteUser();
      let res = await fetch(
        'https://meliora-backend.herokuapp.com/api/users/deleteAccount',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: this.userID,
          }),
        }
      );
      if (res.status == 200) {
        let resBody = await res.json();
        console.log(resBody.msg);
      }
    }
  }

  async onPrivateChanged() {
    this.private = !this.private;
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/setPrivate',
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
  }

  async notificationChange() {
    var newSelection = <HTMLSelectElement> (document.getElementById("notificationOptions"));
    this.settings.notificationPreference = parseInt(newSelection.value);
  }
}
