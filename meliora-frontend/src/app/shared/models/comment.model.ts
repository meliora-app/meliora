export class Comment {
    public content: string;
    public profileID: string;
    public postID: string;
    public commentID: string
  
    constructor(
      commentID: string,
      postID: string,
      content: string,
      profileID: string,
    ) {
      this.commentID = commentID;
      this.postID = postID;
      this.content = content;
      this.profileID = profileID;
    }
  }
  