import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostCardComponent, Post } from '../post-card/post-card.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  darkModeStatus = true;
  //localStorage.getItem("darkModeStatus");

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {  }

  loggedInUser: string = localStorage.getItem('userID');
  viewedUserID: string;
  viewedUsername: string;
  viewedUserNumPosts: any;
  bio: String;
  posts: Post[] = [];
  isSelf: boolean = true;

  async loadProfile(username: String) {
    
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
          this.posts.push(new Post(postResBody[i]._id, postResBody[i].title, postResBody[i].content, this.viewedUsername));
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
    this.activatedRoute.queryParams.subscribe(params => {
      this.viewedUserID = params._id;
      console.log("Viewed user: " + this.viewedUserID);
    })
    this.loadProfile(this.viewedUserID);
  }

  onEditProfileClick() {
    this.router.navigate(['/edit-profile'], { queryParams: {"username": this.viewedUsername, "bio": this.bio}});
  }

}
