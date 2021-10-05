import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserInfo(userData: {}) {
    var userInfo;
    return new Promise<User>((resolve, reject) => {
      this.http
        .put(
          'https://meliora-backend.herokuapp.com/api/users/getUser',
          userData,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe((responseData) => {
          userData = responseData;
          resolve(userInfo);
          console.log(userData);
        });
    });

    // return userData;
  }

  async userLogin(userData: {}) {
    // var response;
    this.http
      .put('https://meliora-backend.herokuapp.com/api/users/login', userData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe((responseData) => {
        // response = responseData;
        console.log(responseData);
        localStorage.setItem('userID', (<any>responseData)._id);
        localStorage.setItem(
          'darkModeStatus',
          (<any>responseData).darkModeStatus
        );
      });
  }
}
