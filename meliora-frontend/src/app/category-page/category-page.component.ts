import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../shared/models/post.model';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent implements OnInit {
  categoryID: string = '';
  categoryData: {
    id: string;
    name: string;
    description: string;
    followers: string[];
    posts: Post[];
  } = {
    id: '',
    name: '',
    description: '',
    followers: [],
    posts: [],
  };
  posts: Post[];
  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  downloadURL: string = '';
  ref: AngularFireStorageReference;
  following: boolean = false;
  followerCount: number = 0;
  userID: string = localStorage.getItem('userID');

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryID = params.id;
    });
    this.getTopicPic();
    this.loadCategoryContent();
  }

  loadCategoryContent() {
    this.categoryService
      .getByID(this.categoryID)
      .subscribe(
        (categoryData: {
          id: string;
          name: string;
          description: string;
          followers: string[];
          posts: Post[];
        }) => {
          console.log(categoryData);
          this.categoryData = categoryData;
          this.followerCount = this.categoryData.followers.length;
          if (categoryData.followers.includes(this.userID)) {
            this.following = true;
          }
        }
      );
  }

  getTopicPic() {
    this.ref = this.fireStorage.ref('categories/' + this.categoryID + '.jpeg');
    this.ref.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
      // this.timestamp = new Date().getTime();
    });
  }

  onFollowClicked() {
    this.following = !this.following;
    if (this.following === true) {
      this.followerCount = this.followerCount + 1;
    } else {
      this.followerCount = this.followerCount - 1;
    }
    this.categoryService.manageFollower(
      localStorage.getItem('userID'),
      this.categoryID
    );
  }

  postDeletedHandler(event) {}
}
