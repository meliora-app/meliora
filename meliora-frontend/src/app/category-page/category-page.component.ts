import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../shared/models/post.model';
import {
  CategoryService,
  DbCategory,
} from '../shared/services/category.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent implements OnInit {
  categoryID: string = '';
  categoryData: DbCategory;
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  downloadURL: string = '';
  ref: AngularFireStorageReference;
  posts: Post[];
  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryID = params.id;
    });
    this.loadCategoryContent();
  }

  loadCategoryContent() {
    this.categoryService.getByID(this.categoryID).subscribe((categoryData) => {
      this.categoryData = categoryData;
    });
    this.ref = this.fireStorage.ref('categories/' + this.categoryID + '.jpeg');
    this.ref.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
      // this.timestamp = new Date().getTime();
    });
  }

  onFollowClicked() {}

  postDeletedHandler(event) {}
}
