import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  displayConfirmBox = false;
  darkModeStatus = true;
  //localStorage.getItem("darkModeStatus");
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    
  }

  async onLogoutClicked() {
    await this.authService.logout();
    localStorage.removeItem('userID');
    localStorage.removeItem('darkModeStatus');
  }

  onSubmit(form: NgForm) {
    console.log('Inside submit form')
    this.darkModeCheck(form.value.darkmode);
  }

  async darkModeCheck(darkmode: boolean) {
    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/login', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        darkmode
      })
    });

    if (res.status == 200) {
      let resBody = await res.json();
      localStorage.setItem('darkModeStatus', "" + darkmode);
    } else {
      let resBody = await res.json();
      console.log(resBody);
    }
  }

  changePasswordEmail(): void {
    console.log('Inside Change Password')
    this.authService.changePasswordEmail();
  }

  deleteFunction() {
    
  }


}
