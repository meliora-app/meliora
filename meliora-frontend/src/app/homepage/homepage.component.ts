import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  categories = [
    'Friendship',
    'Nature',
    'Adventure',
    'Compassion',
    'Togetherness',
    'Love',
    'Travel',
    'Mindfulness',
  ];
  constructor() {}

  ngOnInit(): void {}
}
