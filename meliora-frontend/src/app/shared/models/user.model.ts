export class User {
  constructor(
    public _id: string,
    public email: string,
    public username: string,
    public darkModeStatus: boolean,
    public authorList: Array<string>,
    public bio: string
  ) {}
}
