import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostCardComponent, Post } from '../post-card/post-card.component';

import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { PostService } from '../shared/services/post.service';

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
  darkModeStatus: boolean = localStorage.getItem("darkModeStatus") == 'true';
  loggedInUser: string = localStorage.getItem('userID');
  viewedUserID: string;
  viewedUsername: string;
  bio: String;
  posts: Post[] = [];
  isSelf: boolean = true;
  viewedUserNumPosts: number = this.posts.length;
  numLikes = 0;
  numThumbs = 0;
  numSmileys = 0;
  numHugs = 0;
  belongsToUser: boolean;
  isNotUser: boolean;
  followAdd: boolean = true; // plus button to follow user
  followCheck: boolean = false; // check button to indicate current user is following viewed user
  unfollow: boolean = false; // minus button to unfollow user
  block: boolean = true;
  unblock: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private fireStorage: AngularFireStorage) { }

  async loadProfile() {
    this.getProfilePic();
    this.darkModeStatus = (localStorage.getItem("darkModeStatus") == "true");
    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/getUser', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: this.viewedUserID
      })
    });

    if (res.status == 200) {
      console.log("SUCCESS");
      let resBody = await res.json();
      this.viewedUsername = resBody.username;
      this.bio = resBody.bio;
      let postRes = await fetch('https://meliora-backend.herokuapp.com/api/posts/getPostsBy', {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: this.viewedUserID
        })
      });
      if (postRes.status == 200) {
        let postResBody = await postRes.json();
        this.viewedUserNumPosts = postResBody.length;
        for (let i = 0; i < postResBody.length; i++) {
          if (!postResBody[i].anonymous || this.belongsToUser) {
            this.posts.push(new Post(postResBody[i]._id, postResBody[i].title, postResBody[i].content, postResBody[i].author, postResBody[i].anonymous, this.viewedUsername));
          }
        }
        console.log("SUCCESS");
      }

    }


  }

  // handler to refresh profile page after post is deleted
  postDeletedHandler(msg: string) {
    this.posts.length = 0;
    window.location.reload();
  }

  ngOnInit(): void {
    this.getProfilePic();
    this.activatedRoute.queryParams.subscribe(params => {
      this.viewedUserID = params._id;
      console.log("Viewed user: " + this.viewedUserID);
    });
    this.belongsToUser = this.viewedUserID == this.userId;
    this.isNotUser = !this.belongsToUser;
    this.loadProfile();
  }

  onEditProfileClick() {
    this.router.navigate(['/edit-profile'], { queryParams: { "username": this.viewedUsername, "bio": this.bio, "numPosts": this.viewedUserNumPosts } });
  }

  // displayProfilePic() {
  //   if (this.timestamp) {
  //     return this.downloadURL + '?' + this.timestamp;
  //   }
  //   return this.downloadURL;
  // }

  getProfilePic() {
    this.ref = this.fireStorage.ref('profilePictures/' + this.viewedUserID);
    this.ref.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
      // this.timestamp = new Date().getTime();
    });
  }

  onFollowAddClicked() {
    this.followCheck = true;
    this.followAdd = false;
    this.unfollow = true;
  }

  onUnfollowedClicked() {
    this.followCheck = false;
    this.followAdd = true;
    this.unfollow = false;
    alert("Are you sure you want to unfollow " + this.viewedUsername + "?");
  }

  onBlockClicked() {
    this.block = false;
    this.unblock = true;
    alert("Are you sure you want to block " + this.viewedUsername + "?");
  }

  onUnblockClicked() {
    this.block = true;
    this.unblock = false;
    alert("Are you sure you want to unblock " + this.viewedUsername + "?");
  }
}
