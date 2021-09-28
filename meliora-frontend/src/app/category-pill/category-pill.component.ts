import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-pill',
  templateUrl: './category-pill.component.html',
  styleUrls: ['./category-pill.component.css'],
})
export class CategoryPillComponent implements OnInit {
  @Input() categoryName: string;

  constructor() {}

  ngOnInit(): void {}
}
