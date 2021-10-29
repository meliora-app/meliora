import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Post } from '../shared/models/post.model';
import { Reaction } from '../shared/models/reaction.model';
import { PostService } from '../shared/services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @Input() post: Post; // Post used as input for template
  @Input() isExpanded: boolean;
  @Output() postDeleted: EventEmitter<string> = new EventEmitter();
  bookmarkClicked: boolean = false;
  userID: string = localStorage.getItem('userID');
  thumbsUp: boolean = false;
  postContent: string = '';
  smileyFace: boolean = false;
  heart: boolean = false;
  hugs: boolean = false;
  addReaction: boolean; // checks if reaction is selected
  isNotUser: boolean;

  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  ref: AngularFireStorageReference;
  // timestamp;
  downloadURL: string;
  belongsToUser: boolean;
  constructor(
    private route: Router,
    private fireStorage: AngularFireStorage,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    if (!this.isExpanded) {
      this.postContent = this.postService.trimPost(this.post.content);
    }
    this.getProfilePic();
    this.belongsToUser = this.userID == this.post.authorID;
  }

  async deletePostClicked(postID: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      let res = await fetch(
        'https://meliora-backend.herokuapp.com/api/posts/deletePost',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: postID,
            author: localStorage.getItem('userID'),
          }),
        }
      );
      if (res.status == 200) {
        let resBody = await res.json();
        console.log(resBody.msg);
        // TODO RELOAD PROFILE PAGE
        this.postDeleted.emit('deleted: ' + resBody._id);
        window.location.reload();
      }
    }
  }

  // route to profile with clicked user
  userClicked() {
    this.route.navigate(['/profile'], {
      queryParams: { _id: this.post.authorID },
    });
  }

  getProfilePic() {
    this.ref = this.fireStorage.ref('profilePictures/' + this.post.authorID);
    this.ref.getDownloadURL().subscribe((url) => {
      this.downloadURL = url;
      // this.timestamp = new Date().getTime();
    });
  }

  onBookmarkClicked() {
    this.bookmarkClicked = !this.bookmarkClicked;
  }

  onThumbUpClicked() {
    this.thumbsUp = !this.thumbsUp;
    this.addReaction = this.thumbsUp;
    if (this.thumbsUp) {
      this.postService.storeReaction(
        Reaction.THUMB,
        this.post.postID,
        this.userID
      );
    }
  }

  onSmileyFaceClicked() {
    this.smileyFace = !this.smileyFace;
    this.addReaction = this.smileyFace;
    if (this.smileyFace) {
      this.postService.storeReaction(
        Reaction.SMILEY,
        this.post.postID,
        this.userID
      );
    }
  }

  onHeartClicked() {
    this.heart = !this.heart;
    this.addReaction = this.heart;
    if (this.heart) {
      this.postService.storeReaction(
        Reaction.HEART,
        this.post.postID,
        this.userID
      );
    }
  }

  onHugsClicked() {
    this.hugs = !this.hugs;
    this.addReaction = this.hugs;
    if (this.hugs) {
      this.postService.storeReaction(
        Reaction.HUG,
        this.post.postID,
        this.userID
      );
    }
  }
}
