import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

export interface DbCategory {
  _id: string;
  name: string;
  description: string;
  followers: string[];
  posts: PostData[];
}

export interface PostData {
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
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) { }

  async getAll() {
    return this.http
      .get('https://meliora-backend.herokuapp.com/api/categories/getAll')
      .pipe(
        map((categoryData: DbCategory[]) => {
          var categoryList = categoryData.map((category) => {
            return { id: category['_id'], name: category.name };
          });
          return categoryList;
        })
      );
  }

  getByID(id: string) {
    return this.http
      .get(
        `https://meliora-backend.herokuapp.com/api/categories/getById?id=${id}`
      )
      .pipe(
        map(
          (categoryData: {
            categoryData: {
              id: string;
              name: string;
              description: string;
              followers: string[];
              posts: string[];
            };
            posts: PostData[];
          }) => {
            console.log(categoryData);
            var newPosts = categoryData.posts.filter((post) => post != null);
            var posts = newPosts.map((post) => {
              if (post != null) {
                return {
                  postID: post._id,
                  title: post.title,
                  content: post.content,
                  authorID: post.author,
                  categoryID: post.category,
                  anon: post.anonymous,
                  authorUsername: post.authorName,
                };
              } else {
                return null;
              }
            });

            return {
              ...categoryData.categoryData,
              posts: posts,
            };
          }
        )
      );
  }

  manageFollower(userID: string, categoryID: string) {
    var data = {
      userID: userID,
      categoryID: categoryID,
    };
    this.http
      .post(
        'https://meliora-backend.herokuapp.com/api/categories/manageFollower',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  getPostsByCategoryFollowed(userID: string) {
    var url = 'https://meliora-backend.herokuapp.com/api/categories/getPostsByCatFol?userID=' + userID;
    return this.http.get(
      url
    );
  }

  createCategory(name: string, description: string, creator: string) {
    var url = 'https://meliora-backend.herokuapp.com/api/categories/create';
    this.http.post(
      url,
      { name: name, description: description, creator: creator },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).subscribe((res) => {
      console.log(res);
    });
  }
}


