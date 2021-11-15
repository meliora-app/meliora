import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/services/category.service';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-posts-by-category',
  templateUrl: './posts-by-category.component.html',
  styleUrls: ['./posts-by-category.component.css']
})
export class PostsByCategoryComponent implements OnInit {

  posts: Post[] = [];
  userID: string = localStorage.getItem('userID');

  constructor(private categoryService: CategoryService) {

  }

  ngOnInit(): void {
    // posts: Post[] = [];
    this.loadFeed();
  }

  async loadFeed() {

    this.categoryService.getPostsByCategoryFollowed(this.userID).subscribe(async (postData: any) => {
      console.log(postData);
      for (var i = 0; i < postData.length; i++) {
        if (postData[i] != null) {
          let resUser = await fetch(
            'https://meliora-backend.herokuapp.com/api/users/getUser',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                _id: postData[i].author,
              }),
            }
          );
          if (resUser.status == 200) {
            let resUserBody = await resUser.json();
            this.posts.push(new Post(
              postData[i]._id,
              postData[i].title,
              postData[i].content,
              postData[i].author,
              postData[i].category,
              postData[i].anonymous,
              resUserBody.username,
              postData[i].commentsAllowed
            ));
          }
        }
      }

    });
  }

}
