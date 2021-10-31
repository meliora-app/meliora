import { Component, OnInit } from '@angular/core';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  posts: Post[] = [];
  //localStorage.getItem("darkModeStatus");
  categories = [
    'Friendship',
    'Nature',
    'Adventure',
    'Compassion',
    'Togetherness',
    'Love',
    'Travel',
    'Mindfulness',
  ];
  constructor() {}

  ngOnInit(): void {
    this.loadFeed();
  }

  async loadFeed() {
    /*
    let res = await fetch('https://meliora-backend.herokuapp.com/api/posts/getAll', {
      method: "GET"
    });
    */
    let res = await fetch('https://meliora-backend.herokuapp.com/api/posts/getFollowingPosts', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: localStorage.getItem('userID')
      })
    });
    if (res.status == 200) {
      let resBody = await res.json();
      for (let i = 0; i < resBody.length; i++) {
        // ensure not null, TODO need to remove from author list on delete post
        if (resBody[i] == null) {
          continue;
        }
        // need to get user name with get user, would be helpful to include username with post fetch
        let resUser = await fetch(
          'https://meliora-backend.herokuapp.com/api/users/getUser',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: resBody[i].author,
            }),
          }
        );
        console.log(resUser.status);
        if (resUser.status == 200) {
          let resUserBody = await resUser.json();
          this.posts.push(
            new Post(
              resBody[i]._id,
              resBody[i].title,
              resBody[i].content,
              resBody[i].author,
              resBody[i].category,
              resBody[i].anonymous,
              resUserBody.username
            )
          );
        }
      }
    }
  }
}
