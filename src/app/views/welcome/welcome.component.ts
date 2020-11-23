import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessagesService } from './services/messages.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  messages: Array<{ text: string; }> = [];
  subscription: Subscription;

  constructor(private router: Router, private messagesService: MessagesService) {
    // subscribe to messagesComponent messages
    this.subscription = this.messagesService.onMessage().subscribe(message => {
      if (message) {
          this.messages.push(message);
      } else {
          // clear messages when empty message received
          this.messages = [];
      }
  });
  }

  public ngOnInit(): void {
    this.router.navigate(['/welcome']);
  }

  public ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
}
}
