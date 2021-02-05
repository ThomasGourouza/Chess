import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: Array<User> = [
    {
      firstName: 'Jean',
      lastName: 'Valjean',
      email: 'jean.valjean@gmail.com',
      password: 'mdp',
      sport: 'Tennis',
      languages: ['Français', 'Anglais']
    }
  ];
  private userSubject = new Subject<Array<User>>();
  
  public onUser(): Observable<Array<User>> {
    return this.userSubject.asObservable();
  }

  public emitUsers(): void {
    this.userSubject.next(this.users.slice());
  }

  public addUser(user: User): void {
    this.users.push(user);
    this.emitUsers();
  }
}
