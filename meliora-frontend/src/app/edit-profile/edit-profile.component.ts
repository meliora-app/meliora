import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  userId = localStorage.getItem('userID');
  downloadURL: string;
  constructor(private fireStorage: AngularFireStorage) {}

  ngOnInit(): void {
    this.getProfilePic();
  }

  getProfilePic() {
    this.ref = this.fireStorage.ref('profilePictures/' + this.userId);
    this.ref.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
    });
  }

  editProfilePic(event) {
    this.ref = this.fireStorage.ref('profilePictures/' + this.userId);
    this.task = this.ref.put(event.target.files[0]);
  }
}
