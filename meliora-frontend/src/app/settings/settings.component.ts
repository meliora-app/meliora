import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  displayConfirmBox = false;
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    
  }

  changePasswordEmail(): void {
    console.log('Inside Change Password')
    this.authService.changePasswordEmail();
  }

  deleteFunction() {
    
  }


}
