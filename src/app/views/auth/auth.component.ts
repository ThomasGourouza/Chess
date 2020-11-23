import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  public login: string;
  public password: string;

  constructor(private authService: AuthService, private router: Router) {}

  public ngOnInit(): void {}

  public isAuth(): boolean {
    return this.authService.isAuth;
  }

  public onSignIn(login: string, password: string): void {
    this.authService.signIn(login, password).then((isAuth: boolean) => {
      this.authService.isAuth = isAuth;
      if (!isAuth) {
        alert('le login ou mot de passe est incorrect!');
      } else {
        this.router.navigate(['/chess-board']);
      }
    });
  }

  public onSignOut(): void {
    this.authService.isAuth = false;
  }
}
