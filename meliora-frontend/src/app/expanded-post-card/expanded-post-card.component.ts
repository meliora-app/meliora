import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../shared/models/post.model';
import { PostService } from '../shared/services/post.service';
import { Category } from '../shared/models/category.model';

@Component({
  selector: 'app-expanded-post-card',
  templateUrl: './expanded-post-card.component.html',
  styleUrls: ['./expanded-post-card.component.css'],
})
export class ExpandedPostCardComponent implements OnInit {
  @Output() postDeleted: EventEmitter<string> = new EventEmitter();
  bookmarkClicked: boolean = false;
  thumbsUp: boolean = false;
  isNotUser: boolean;
  postContent: string = '';
  post: Post;
  ref: AngularFireStorageReference;
  downloadURL: string = '';
  belongsToUser: boolean;
  category: Category;

  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.post = {
        title: queryParams.title,
        content: queryParams.content,
        authorUsername: queryParams.authorUsername,
        authorID: queryParams.authorID,
        categoryID: queryParams.categoryID,
        postID: queryParams.postID,
        anon: queryParams.anon === 'true',
      };
      this.downloadURL = queryParams.downloadURL;
      this.category = queryParams.category;
    });
    this.getPost();
    console.log(this.post);
    this.belongsToUser = localStorage.getItem('userID') == this.post.authorID;
  }

  // route to profile with clicked user
  userClicked() {
    this.router.navigate(['/profile'], {
      queryParams: { _id: this.post.authorID },
    });
  }

  async getPost() {
    var postData = await this.postService.getPostByID(this.post.postID);
  }

  async deletePostClicked(postID: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      let res = await fetch(
        'https://meliora-backend.herokuapp.com/api/posts/deletePost',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: postID,
            author: localStorage.getItem('userID'),
          }),
        }
      );
      if (res.status == 200) {
        let resBody = await res.json();
        console.log(resBody.msg);
        // TODO RELOAD PROFILE PAGE
        this.postDeleted.emit('deleted: ' + resBody._id);
        window.location.reload();
      }
    }
  }
}
