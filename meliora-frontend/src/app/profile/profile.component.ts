import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  ref: AngularFireStorageReference;
  // timestamp;
  downloadURL: string;
  userId: string = localStorage.getItem('userID');
  darkModeStatus = false;
  //localStorage.getItem("darkModeStatus");

  constructor(private fireStorage: AngularFireStorage) {}

  ngOnInit(): void {
    this.getProfilePic();
  }

  // displayProfilePic() {
  //   if (this.timestamp) {
  //     return this.downloadURL + '?' + this.timestamp;
  //   }
  //   return this.downloadURL;
  // }

  getProfilePic() {
    this.ref = this.fireStorage.ref('profilePictures/' + this.userId);
    this.ref.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
      // this.timestamp = new Date().getTime();
    });
  }
}
