import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getAllNotifications(userID: string) {
    return this.http.put(
      'https://meliora-backend.herokuapp.com/api/notifications/',
      { userID: userID },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  clearNotifications(userID: string) {
    return this.http.request(
      'delete',
      'https://meliora-backend.herokuapp.com/api/notifications/clear',
      { body: { userID: userID } }
    );
  }
}
