import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/models/category.model';
import { TrendingService } from '../shared/services/trending.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css'],
})
export class TrendingComponent implements OnInit {
  trendingCategories: Category[];
  constructor(private trendingService: TrendingService) {}

  ngOnInit(): void {}

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
}
