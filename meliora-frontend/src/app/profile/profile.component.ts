import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../shared/models/post.model';

import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { PostService } from '../shared/services/post.service';
import { UserService } from '../shared/services/userServices/user.service';
import { ThrowStmt } from '@angular/compiler';

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
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  loggedInUser: string = localStorage.getItem('userID');
  viewedUserID: string;
  viewedUsername: string;
  bio: String;
  posts: Post[] = [];
  userPosts: Post[] = [];
  bookmarkedPosts: Post[] = [];
  isSelf: boolean = true;
  viewedUserNumPosts: number = this.posts.length;
  numLikes: any = '--';
  numThumbs: any = '--';
  numSmileys: any = '--';
  numHugs: any = '--';
  eqPoints: any = '--';
  belongsToUser: boolean;
  isNotUser: boolean;
  followAdd: boolean = true; // plus button to follow user
  followCheck: boolean = false; // check button to indicate current user is following viewed user
  block: boolean;
  unblock: boolean;
  userBlocked: boolean;
  numFollowing: number = 0;
  numFollowers: number = 0;
  viewBookmarks: boolean = false; // determine whether viewing bookmarked posts or user posts
  isPrivate: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fireStorage: AngularFireStorage,
    private userService: UserService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.calcNumReactions();
    this.setFollowingVars();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.viewedUserID = params._id;
    });
    this.getProfilePic();
    this.belongsToUser = this.viewedUserID == this.userId;
    this.isNotUser = !this.belongsToUser;
    this.loadProfile();
  }

  async calcNumReactions() {
    this.userService.getUserPosts(this.viewedUserID).then((posts) => {
      console.log('posts = ' + posts);
    });
  }

  async loadProfile() {
    this.darkModeStatus = localStorage.getItem('darkModeStatus') == 'true';
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: this.viewedUserID,
        }),
      }
    );

    if (res.status == 200) {
      let resBody = await res.json();
      this.viewedUsername = resBody.username;
      this.bio = resBody.bio;
      this.numFollowers = resBody.followers.length;
      this.numFollowing = resBody.following.length;
      this.userBlocked = resBody.blocked.includes(this.loggedInUser);
      this.isPrivate = resBody.private;
      for (let i = 0; i < resBody.bookmarks.length; i++) {
        this.bookmarkedPosts.push(
          new Post(
            resBody.bookmarks[i]._id,
            resBody.bookmarks[i].title,
            resBody.bookmarks[i].content,
            resBody.bookmarks[i].author,
            resBody.bookmarks[i].category,
            resBody.bookmarks[i].anonymous,
            await this.userService.getUsername(resBody.bookmarks[i].author),
            resBody.bookmarks[i].commentsAllowed,
            resBody.bookmarks[i].hasPhoto
          )
        );
      }

      if (!this.userBlocked) {
        let postRes = await fetch(
          'https://meliora-backend.herokuapp.com/api/posts/getPostsBy',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userID: this.viewedUserID,
            }),
          }
        );
        if (postRes.status == 200) {
          let postResBody = await postRes.json();
          if (postResBody != null && postResBody != []) {
            this.numLikes = 0;
            this.numThumbs = 0;
            this.numSmileys = 0;
            this.numHugs = 0;
          }
          this.viewedUserNumPosts = postResBody.length;
          for (let i = 0; i < postResBody.length; i++) {
            var reactions = postResBody[i]['reactions'];
            this.numLikes += reactions.hearts;
            this.numThumbs += reactions.thumbs;
            this.numSmileys += reactions.smileys;
            this.numHugs += reactions.hugs;
            if (
              (!postResBody[i].anonymous || this.belongsToUser) &&
              !this.viewBookmarks
            ) {
              this.posts.push(
                new Post(
                  postResBody[i]._id,
                  postResBody[i].title,
                  postResBody[i].content,
                  postResBody[i].author,
                  postResBody[i].category,
                  postResBody[i].anonymous,
                  this.viewedUsername,
                  postResBody[i].commentsAllowed,
                  postResBody[i].hasPhoto
                )
              );
              this.userPosts.push(
                new Post(
                  postResBody[i]._id,
                  postResBody[i].title,
                  postResBody[i].content,
                  postResBody[i].author,
                  postResBody[i].category,
                  postResBody[i].anonymous,
                  this.viewedUsername,
                  postResBody[i].commentsAllowed,
                  postResBody[i].hasPhoto
                )
              );
            }
          }
        }
      }
    }
  }

  // handler to refresh profile page after post is deleted
  postDeletedHandler(msg: string) {
    this.posts.length = 0;
    window.location.reload();
  }

  onEditProfileClick() {
    this.router.navigate(['/edit-profile'], {
      queryParams: {
        username: this.viewedUsername,
        bio: this.bio,
        numPosts: this.viewedUserNumPosts,
      },
    });
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
      //this.timestamp = new Date().getTime();
    });
  }

  async onFollowAddClicked() {
    // backend call
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/follow',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerID: this.loggedInUser,
          followedID: this.viewedUserID,
        }),
      }
    );
    if (res.status == 200) {
      this.followCheck = true;
      this.followAdd = false;
      this.numFollowers++;
      // window.location.reload();
    }
  }

  async onUnfollowedClicked() {
    // if (
    //   confirm('Are you sure you want to unfollow ' + this.viewedUsername + '?')
    // ) {
    //backend call
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/unfollow',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerID: this.loggedInUser,
          followedID: this.viewedUserID,
        }),
      }
    );
    if (res.status == 200) {
      this.followCheck = false;
      this.followAdd = true;
      this.numFollowers--;
    }
    // }
  }

  async onBlockClicked() {
    if (
      confirm('Are you sure you want to block ' + this.viewedUsername + '?')
    ) {
      // backend call
      let res = await fetch(
        'https://meliora-backend.herokuapp.com/api/users/block',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blockerID: this.loggedInUser,
            blockedID: this.viewedUserID,
          }),
        }
      );
      if (res.status == 200) {
        this.block = false;
        this.unblock = true;
        await this.onUnfollowedClicked();
        res = await fetch(
          'https://meliora-backend.herokuapp.com/api/users/unfollow',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              followerID: this.viewedUserID,
              followedID: this.loggedInUser,
            }),
          }
        );
      }
    }
  }

  async onUnblockClicked() {
    if (
      confirm('Are you sure you want to unblock ' + this.viewedUsername + '?')
    ) {
      // backend call
      let res = await fetch(
        'https://meliora-backend.herokuapp.com/api/users/block',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blockerID: this.loggedInUser,
            blockedID: this.viewedUserID,
          }),
        }
      );
      if (res.status == 200) {
        this.block = true;
        this.unblock = false;
      }
    }
  }

  async onPostsClicked() {
    this.viewBookmarks = false;
    this.posts = this.userPosts;
  }

  async onBookmarksClicked() {
    this.viewBookmarks = true;
    this.posts = this.bookmarkedPosts;
  }

  // this process is slow right now, we need to keep all current user information on hand
  async setFollowingVars() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: this.loggedInUser,
        }),
      }
    );

    if (res.status == 200) {
      let resBody = await res.json();
      this.followCheck = resBody.following.includes(this.viewedUserID);
      this.followAdd = !this.followCheck;
      this.block = !resBody.blocked.includes(this.viewedUserID);
      this.unblock = !this.block;
    }
  }
}
