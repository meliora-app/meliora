import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';
import { NotificationsService } from '../shared/services/notification.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrls: ['./home-navbar.component.css'],
})
export class HomeNavbarComponent implements OnInit {
  username: string;
  notificationsClicked: boolean = false;
  userID: string = localStorage.getItem('userID');
  notifications = [];
  searchOptions: string[] = [];
  formControl = new FormControl();
  data: any;
  constructor(
    public authService: AuthService,
    private route: Router,
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getUsername();
    this.retrieveNotifications();
  }

  async getUsername() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: localStorage.getItem('userID'),
        }),
      }
    );
    if (res.status == 200) {
      let resBody = await res.json();
      this.username = resBody.username;
    }
  }

  async retrieveNotifications() {
    this.notifService
      .getAllNotifications(this.userID)
      .subscribe((result: []) => {
        this.notifications = result;
        console.log(result);
      });
  }

  async onClearNotifsClicked() {
    this.notifService
      .clearNotifications(this.userID)
      .subscribe((result: any) => {
        if (result === true) {
          this.notifications = [];
        }
      });
  }

  async onLogoutClicked() {
    await this.authService.logout();
    localStorage.removeItem('userID');
    localStorage.removeItem('darkModeStatus');
  }

  onMyProfileClicked() {
    this.route.navigate(['/profile'], {
      queryParams: { _id: localStorage.getItem('userID') },
    });
  }

  async onSearchClicked() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.formControl.value,
        }),
      }
    );

    if (res.status == 200) {
      let resBody = await res.json();
      this.route.navigate(['/profile'], { queryParams: { _id: resBody._id } });
    }
  }

  /*
  async searchUpdate() {
    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/searchSuggestion', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input:  (<HTMLInputElement>document.getElementById("search")).value

      })
    });
    if (res.status == 200) {
      let results = await res.json();
      for (let user of results) {
        this.searchOptions.push(user.username);
      }
    }
  }
  */
  async searchUpdate() {
    this.searchOptions = [];
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/searchSuggestion',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: this.formControl.value,
        }),
      }
    );
    if (res.status == 200) {
      let results = await res.json();
      for (let user of results) {
        this.searchOptions.push(user.username);
      }
    }
  }
}
