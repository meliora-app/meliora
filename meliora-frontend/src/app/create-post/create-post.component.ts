import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../shared/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  visibilityClicked: boolean = false;
  imageClicked: boolean = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    console.log(localStorage.getItem('userID'));
  }

  async onSubmitPost(form: NgForm) {
    await this.postService.createPost(
      form.value.title,
      form.value.content,
      localStorage.getItem('userID'),
      this.visibilityClicked
    );
  }

  onVisibilityClicked() {
    this.visibilityClicked = !this.visibilityClicked;
    console.log(this.visibilityClicked);
  }

  onImageClicked() {
    this.imageClicked = !this.imageClicked;
  }
}
