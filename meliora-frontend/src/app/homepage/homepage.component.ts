import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/models/category.model';
import { Post } from '../shared/models/post.model';
import { CategoryService } from '../shared/services/category.service';
import { TrendingService } from '../shared/services/trending.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  posts: Post[] = [];
  trendingCategories: Category[] = [];
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
  constructor(private trendingService: TrendingService) {}

  ngOnInit(): void {
    this.getTrendingCategories();
    this.loadFeed();
  }

  async getTrendingCategories() {
    this.trendingService.getTrendingCategories().subscribe((result) => {
      for (var i = 0; i < result.length; i++) {
        console.log(result[i]);
        this.trendingCategories.push({
          id: result[i].category.id,
          name: result[i].category.name,
        });
      }
    });
  }

  async loadFeed() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/posts/getAll',
      {
        method: 'GET',
      }
    );
    if (res.status == 200) {
      let resBody = await res.json();
      for (let i = 0; i < resBody.length; i++) {
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
