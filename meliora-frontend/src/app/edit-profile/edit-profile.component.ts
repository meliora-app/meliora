import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  bio: string = 'test';
  username: string;
  userID: string = localStorage.getItem('userID');
  numPosts: number;
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.getProfilePic();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.bio = params.bio;
      this.username = params.username;
      this.numPosts = params.numPosts;
    });
  }

  returnToProfile() {
    this.route.navigate(['/profile'], {
      queryParams: { _id: localStorage.getItem('userID') },
    });
  }

  async onSaveProfileClicked(newBio: string) {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/updateProfile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: this.userID,
          bio: newBio,
        }),
      }
    );
    if (res.status == 200) {
      console.log('Successful account update');
    }
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
