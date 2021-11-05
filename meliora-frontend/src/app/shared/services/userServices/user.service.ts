import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

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

  async getUsername(userID:string) {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: userID,
        }),
      }
    );
    if (res.status == 200) {
      let resBody = await res.json();
      return resBody.username;
    }

    // return userData;
  }

  // Likes
  getUserPosts(id: string) {
    var posts;
    // var userData 
    this.http.get(
      'http://meliora-backend.herokuapp.com/api/posts/getAll',
    )
      .subscribe((responseData) => {
        posts = responseData;
        // console.log(userData);
      });
    return posts;

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
