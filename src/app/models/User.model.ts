export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public sport: string,
    public languages?: Array<string>
  ) {}
}
