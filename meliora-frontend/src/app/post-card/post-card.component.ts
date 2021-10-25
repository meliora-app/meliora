import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Router } from '@angular/router'

export class Post {
  public title: string;
  public content: string;
  public authorUsername: string;
  public authorID: string;
  public postID: string;
  public anon: boolean;

  constructor(postID: string, title: string, content: string, authorID: string, anon: boolean, authorUsername: string) {
    this.postID = postID;
    this.title = title;
    this.content = content;
    this.authorUsername = authorUsername;
    this.authorID = authorID;
    this.anon = anon;
  }
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: Post; // Post used as input for template
  @Output() postDeleted: EventEmitter<string> = new EventEmitter();
  bookmarkClicked: boolean = false;
  thumbsUp: boolean = false;
  smileyFace: boolean = false;
  heart: boolean = false;
  addReaction: boolean; // checks if reaction is selected
  isNotUser: boolean;

  darkModeStatus: boolean = localStorage.getItem('darkModeStatus') == 'true';
  ref: AngularFireStorageReference;
  // timestamp;
  downloadURL: string;
  belongsToUser: boolean;
  constructor(private route: Router, private fireStorage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.getProfilePic();
    this.belongsToUser = localStorage.getItem('userID') == this.post.authorID;
    this.isNotUser = !this.belongsToUser;
  }

  async deletePostClicked(postID: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      let res = await fetch('https://meliora-backend.herokuapp.com/api/posts/deletePost', {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: postID,
        author: localStorage.getItem('userID')
      })
    });
    if (res.status == 200) {
      let resBody = await res.json();
      console.log(resBody.msg);
      // TODO RELOAD PROFILE PAGE
      this.postDeleted.emit("deleted: " + resBody._id);
      window.location.reload();
    }
  }
}

// route to profile with clicked user
userClicked() {
  this.route.navigate(['/profile'], { queryParams: {"_id": this.post.authorID}});
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
}

onSmileyFaceClicked() {
  this.smileyFace = !this.smileyFace;
  this.addReaction = this.smileyFace;
}

onHeartClicked() {
  this.heart = !this.heart;
  this.addReaction = this.heart;
}

}
