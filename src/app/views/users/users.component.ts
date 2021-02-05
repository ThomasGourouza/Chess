import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public users: Array<User>;
  public userSubscription: Subscription;

  constructor(private userService: UserService) { }

  public ngOnInit(): void {
    this.userSubscription = this.userService.onUser().subscribe((users: Array<User>) => {
      this.users = users;
    });
    this.userService.emitUsers();
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
