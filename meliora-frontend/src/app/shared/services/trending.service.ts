import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbCategory } from './category.service';

interface TrendingCategory {
  category: DbCategory;
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
    return this.http.get(
      'https://meliora-backend.herokuapp.com/api/posts/getTrending'
    );
  }
}
