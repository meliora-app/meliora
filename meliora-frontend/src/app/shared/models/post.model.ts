export class Post {
  public title: string;
  public content: string;
  public authorUsername: string;
  public authorID: string;
  public postID: string;
  public anon: boolean;

  constructor(
    postID: string,
    title: string,
    content: string,
    authorID: string,
    anon: boolean,
    authorUsername: string
  ) {
    this.postID = postID;
    this.title = title;
    this.content = content;
    this.authorUsername = authorUsername;
    this.authorID = authorID;
    this.anon = anon;
  }
}
