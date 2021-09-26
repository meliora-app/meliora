import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  title = 'Login Title';
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  signIn() {
    this.authService.signIn('djnlsdj', 'nsklfjdk');
  }
}
