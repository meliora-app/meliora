export class Post {
  public title: string;
  public content: string;
  public authorUsername: string;
  public authorID: string;
  public categoryID: string;
  public postID: string;
  public anon: boolean;
  public commentsAllowed: boolean;
  public hasPhoto: boolean;

  constructor(
    postID: string,
    title: string,
    content: string,
    authorID: string,
    categoryID: string,
    anon: boolean,
    authorUsername: string,
    commentsAllowed: boolean,
    hasPhoto: boolean
  ) {
    this.postID = postID;
    this.title = title;
    this.content = content;
    this.categoryID = categoryID;
    this.authorUsername = authorUsername;
    this.authorID = authorID;
    this.anon = anon;
    this.commentsAllowed = commentsAllowed;
    this.hasPhoto = hasPhoto;
  }
}
