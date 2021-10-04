import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/authServices/auth.service';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrls: ['./home-navbar.component.css'],
})
export class HomeNavbarComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  async onLogoutClicked() {
    await this.authService.logout();
  }
}
