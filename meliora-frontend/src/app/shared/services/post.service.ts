import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  async createPost(
    postTitle: string,
    postContent: string,
    author: string,
    anonymous: boolean
  ) {
    var postData = {
      postTitle: postTitle,
      postContent: postContent,
      author: author,
      anonymous: anonymous,
    };

    this.http.post(
      'https://meliora-backend.herokuapp.com/api/posts/create',
      postData
    );
  }
}
