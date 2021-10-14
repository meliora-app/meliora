import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrls: ['./home-navbar.component.css'],
})
export class HomeNavbarComponent implements OnInit {
  username: string;
  constructor(public authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.getUsername();
  }

  async getUsername() {
    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/getUser', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: localStorage.getItem("userID")
      })
    });
    if (res.status == 200) {
      let resBody = await res.json();
      this.username = resBody.username;
    }
  }

  async onLogoutClicked() {
    await this.authService.logout();
    localStorage.removeItem('userID');
    localStorage.removeItem('darkModeStatus');
  }

  onMyProfileClicked() {
    this.route.navigate(['/profile'], { queryParams: {"_id": localStorage.getItem('userID')}});
  }
}
