import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserInfo(email: string) {
    var userData;
    return new Promise<User>((resolve, reject) => {
      this.http
        .put(
          'https://meliora-backend.herokuapp.com/api/users/getUser',
          { email: email },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe((responseData) => {
          userData = responseData;
          resolve(userData);
          console.log(userData);
        });
    });

    // return userData;
  }

  async userLogin(username: string) {
    console.log(username);
    var response;
    this.http
      .put(
        'https://meliora-backend.herokuapp.com/api/users/login',
        { username: username },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .subscribe((responseData) => {
        response = responseData;
        console.log(response);
      });

    localStorage.setItem('userID', response._id);
    localStorage.setItem('darkModeStatus', response.darkModeStatus);
  }
}
