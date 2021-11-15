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
  locPosts: Post[] = [];

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
  Lat: any = -1;
  Long: any = -1;
  locButton: boolean = false;
  likeButton: boolean = false;
  commentButton: boolean = false;


  constructor(private trendingService: TrendingService) { }

  ngOnInit(): void {
    this.getTrendingCategories();
    (this.getCoordinates());
    this.loadFeed();
    // this.filterByLoc();
  }

  async getTrendingCategories() {
    this.trendingService.getTrendingCategories().subscribe((result) => {
      for (var i = 0; i < result.length; i++) {
        console.log(result[i]);
        this.trendingCategories.push({
          id: result[i].category._id,
          name: result[i].category.name,
        });
      }
    });
  }

  async getCoordinates() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    var self = this;

    function success(pos) {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();

      var coordinates = [lat, lng];
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      self.Lat = lat;
      self.Long = lng;

      //this.getCity(coordinates);
      return;

    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    await navigator.geolocation.getCurrentPosition((pos) => {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();

      var coordinates = [lat, lng];
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      this.Lat = lat;
      this.Long = lng;

      //this.getCity(coordinates);
      return;

    }, error, options);
  }

  toggleLocation() {
    this.locButton = true;
    this.likeButton = false;
    this.commentButton = false;
    this.filterByLoc();
    console.log(this.locPosts);
  }

  async filterByLoc() {

    let res = await fetch('https://meliora-backend.herokuapp.com/api/posts/getPostsByLoc?userID=' + localStorage.getItem('userID') + '&lat=' + this.Lat + '&long=' + this.Long);
    console.log('lat=' + this.Lat);
    console.log('long=' + this.Long);

    if (res.status == 200) {
      let resBody = await res.json();
      console.log(resBody);
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
        var tempLocPosts = [];
        if (resUser.status == 200) {
          let resUserBody = await resUser.json();
          console.log('hidden or not = ' + resBody[i].hidden);
          console.log('author = ' + resBody[i].author);
          console.log(
            'localStorage Author = ' + localStorage.getItem('userID')
          );
          console.log('title = ' + resBody[i].title);
          if (
            !resBody[i].hidden ||
            resBody[i].author == localStorage.getItem('userID')
          ) {
            tempLocPosts.push(
              new Post(
                resBody[i]._id,
                resBody[i].title,
                resBody[i].content,
                resBody[i].author,
                resBody[i].category,
                resBody[i].anonymous,
                resUserBody.username,
                resBody[i].commentsAllowed

              )
            );
          }
          this.locPosts = tempLocPosts;
        }
      }

    }


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
          console.log('hidden or not = ' + resBody[i].hidden);
          console.log('author = ' + resBody[i].author);
          console.log(
            'localStorage Author = ' + localStorage.getItem('userID')
          );
          console.log('title = ' + resBody[i].title);
          if (
            !resBody[i].hidden ||
            resBody[i].author == localStorage.getItem('userID')
          ) {
            this.posts.push(
              new Post(
                resBody[i]._id,
                resBody[i].title,
                resBody[i].content,
                resBody[i].author,
                resBody[i].category,
                resBody[i].anonymous,
                resUserBody.username,
                resBody[i].commentsAllowed

              )
            );
          }
        }
      }
    }
  }
}
