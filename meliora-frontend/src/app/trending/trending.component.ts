import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/models/category.model';
import { Post } from '../shared/models/post.model';
import { TrendingService } from '../shared/services/trending.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css'],
})
export class TrendingComponent implements OnInit {
  trendingCategories: Category[] = [];
  trendingPosts: Post[] = [];
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  constructor(private trendingService: TrendingService) {}

  ngOnInit(): void {
    this.getTrendingCategories();
    this.getTrendingPosts();
  }

  getTrendingCategories() {
    this.trendingService.getTrendingCategories().subscribe((result) => {
      for (var i = 0; i < result.length; i++) {
        this.trendingCategories.push({
          id: result[i].category.id,
          name: result[i].category.name,
        });
        console.log(this.trendingCategories);
      }
    });
  }

  getTrendingPosts() {
    this.trendingService.getTrendingPosts().subscribe((result) => {
      for (var i = 0; i < result.length; i++) {
        this.trendingPosts.push(result[i]);
      }
    });
    console.log(this.trendingPosts);
  }
}
