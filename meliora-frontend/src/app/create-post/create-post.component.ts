import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../shared/services/category.service';
import { PostService } from '../shared/services/post.service';
import { ToastService } from '../shared/services/toast.service';
import { Category } from '../shared/models/category.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  darkModeStatus = localStorage.getItem('darkModeStatus') == 'true';
  visibilityClicked: boolean = false;
  imageClicked: boolean = false;
  commentClicked: boolean = false;
  categories: Category[];
  words: number = 0;

  constructor(
    private postService: PostService,
    private router: Router,
    private toast: ToastService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    console.log(localStorage.getItem('userID'));
  }

  async getCategories() {
    (await this.categoryService.getAll()).subscribe((categoryData) => {
      this.categories = categoryData;
    });
  }

  wordCount(event) {
    this.words = event.target.value
      ? event.target.value.split(/\s+/).length
      : 0;
  }

  async onSubmitPost(form: NgForm) {
    var categoryIndex = this.categories.findIndex(
      (item) => item.name === form.value.category
    );
    var categoryID = this.categories[categoryIndex].id;
    console.log(form.value.category);
    console.log(this.categories);
    console.log(categoryIndex);
    console.log(categoryID);
    await this.postService.createPost(
      form.value.title,
      form.value.content,
      categoryID,
      localStorage.getItem('userID'),
      this.visibilityClicked
      //this.commentClicked
    );

    this.router.navigate(['/home']);
    this.toast.showSuccessMessage('Post created successfully', 'Post');
  }

  onVisibilityClicked() {
    this.visibilityClicked = !this.visibilityClicked;
    console.log(this.visibilityClicked);
  }

  onImageClicked() {
    this.imageClicked = !this.imageClicked;
  }

  onCommentClicked() {
    this.commentClicked = !this.commentClicked;
  }
}
