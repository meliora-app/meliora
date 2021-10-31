export class Comment {
    public content: string;
    public profileID: string;
    public postID: string;
  
    constructor(
      postID: string,
      content: string,
      profileID: string,
    ) {
      this.postID = postID;
      this.content = content;
      this.profileID = profileID;
    }
  }
  