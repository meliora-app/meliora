import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './landing-navbar.component.html',
  styleUrls: ['./landing-navbar.component.css'],
})
export class LandingNavbarComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {}

  onAboutClicked(elementID: string) {
    // this.router.navigate(['/landing-page', { fragment: elementID }]);
    this.document.location.href = 'http://localhost:4200/#about-section';
  }
}
