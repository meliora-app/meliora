import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reaction } from '../models/reaction.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  async createPost(
    postTitle: string,
    postContent: string,
    category: string,
    author: string,
    anonymous: boolean
  ) {
    var postData = {
      title: postTitle,
      content: postContent,
      category: category,
      author: author,
      hidden: false,
      anonymous: anonymous,
    };

    console.log(postData);

    this.http
      .post(
        'https://meliora-backend.herokuapp.com/api/posts/create',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  async getPostByID(id: string) {
    var body = {
      post: id,
    };
    var postData;
    this.http
      .put('https://meliora-backend.herokuapp.com/api/reaction/getPost', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .subscribe((responseData) => {
        console.log(responseData);
        postData = responseData;
      });

    return postData;
  }

  trimPost(content: string) {
    var words = content.split(' ');
    var newContent = content;
    if (words.length > 80) {
      newContent = words.slice(0, 80).join(' ');
    }

    return newContent;
  }

  storeReaction(reaction: Reaction, postID: string, profileID: string) {
    this.http
      .post(
        'https://meliora-backend.herokuapp.com/api/reaction/add',
        {
          reaction: reaction,
          profileID: profileID,
          postID: postID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
