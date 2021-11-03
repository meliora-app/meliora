import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

export interface DbCategory {
  id: string;
  name: string;
  description: string;
  followers: string[];
  posts: string[];
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

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
    return this.http.get<DbCategory>(
      `https://meliora-backend.herokuapp.com/api/categories/getById?id=${id}`
    );
  }
}
