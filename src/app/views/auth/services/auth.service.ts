import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private _isAuth = false;

  get isAuth(): boolean {
    return this._isAuth;
  }

  set isAuth(value: boolean) {
    this._isAuth = value;
  }

  public signIn(login: string, password: string): Promise<unknown> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(login === 'tom' && password === 'mdp');
      }, 1000);
    });
  }
}
