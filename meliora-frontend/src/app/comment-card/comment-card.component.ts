import { Component, Input, OnInit } from '@angular/core';
import { Comment } from "../shared/models/comment.model"

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment; // Post used as input for template

  constructor() { }

  ngOnInit(): void {
  }

}
