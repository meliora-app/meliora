import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../shared/services/post.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})

export class CreatePostComponent implements OnInit {
  darkModeStatus = localStorage.getItem("darkModeStatus") == 'true';
  visibilityClicked: boolean = false;
  imageClicked: boolean = false;
  commentClicked: boolean = false;  
  words: number = 0;

  constructor(
    private postService: PostService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    console.log(localStorage.getItem('userID'));
  }

  wordCount(event) {
    this.words = event.target.value ? event.target.value.split(/\s+/).length : 0;
  }
  
  async onSubmitPost(form: NgForm) {
    await this.postService.createPost(
      form.value.title,
      form.value.content,
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
