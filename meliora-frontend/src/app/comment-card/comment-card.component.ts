import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comment } from "../shared/models/comment.model"
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment; // Post used as input for template
  @Input() post: Post;
  author: string;
  canDelete: boolean = false;

  constructor(  private route: Router) { }

  ngOnInit(): void {
    this.loadUsername();
    // determine if comment can be deleted
    if (this.comment.profileID == localStorage.getItem("userID") || this.post.authorID == localStorage.getItem("userID")) {
      this.canDelete = true;
    }
  }

  async loadUsername() {
    let res = await fetch(
      'https://meliora-backend.herokuapp.com/api/users/getUser',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: this.comment.profileID,
        }),
      }
    );
    if (res.status == 200) {
        let resBody = await res.json();
        this.author = resBody.username;

    }
  }

  onUsernameClick() {
    this.route.navigate(['/profile'], {
      queryParams: { _id: this.comment.profileID },
    });
  }

  async deleteCommentClicked() {
    console.log(this.comment.commentID);
    // delete comment backend
    if (confirm('Are you sure you want to delete this comment?')) {
      let res = await fetch(
        'https://meliora-backend.herokuapp.com/api/comment/deleteComment',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentID: this.comment.commentID,
          })
        }
      );
      window.location.reload();
    }
  }

}
