import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { DbCategory } from './category.service';

interface TrendingCategory {
  category: DbCategory;
  count: number;
}

interface TrendingPost {
  post: Post;
  count: number;
}

interface DbPost {
  post: {
    location: {
      latitude: any;
      longitude: any;
    };
    reactions: {
      hearts: number;
      thumbs: number;
      smileys: number;
      hugs: number;
      creation_date: Date;
    };
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    authorName: string;
    flags: number;
    delinquent: boolean;
    anonymous: boolean;
    hidden: boolean;
    commentsAllowed: boolean;
    timeStamp: Date;
    __v: number;
  };
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class TrendingService {
  constructor(private http: HttpClient) {}

  getTrendingCategories() {
    return this.http.get<TrendingCategory[]>(
      'https://meliora-backend.herokuapp.com/api/categories/getTrending'
    );
  }

  getTrendingPosts() {
    return this.http
      .get('https://meliora-backend.herokuapp.com/api/posts/getTrending')
      .pipe(
        map((postData: DbPost[]) => {
          var transformedPostData = postData.map((post) => {
            return {
              postID: post.post._id,
              title: post.post.title,
              content: post.post.content,
              authorID: post.post.author,
              categoryID: post.post.category,
              anon: post.post.anonymous,
              authorUsername: post.post.authorName,
              commentsAllowed: post.post.commentsAllowed
            };
          });
          return transformedPostData;
        })
      );
  }
}
