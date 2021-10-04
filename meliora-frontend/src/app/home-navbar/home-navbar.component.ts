import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/authServices/auth.service';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrls: ['./home-navbar.component.css'],
})
export class HomeNavbarComponent implements OnInit {
  constructor(public authService: AuthService, private route: Router) {}

  ngOnInit(): void {}

  async onLogoutClicked() {
    await this.authService.logout();
    localStorage.removeItem('userID');
    localStorage.removeItem('darkModeStatus');
  }

  onMyProfileClicked() {
    this.route.navigate(['/profile'], { queryParams: {"_id": localStorage.getItem('userID')}});
  }
}
