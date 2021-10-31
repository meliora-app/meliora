import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comment } from "../shared/models/comment.model"

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment; // Post used as input for template
  author: string;

  constructor(  private route: Router) { }

  ngOnInit(): void {
    this.loadUsername();
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

}
