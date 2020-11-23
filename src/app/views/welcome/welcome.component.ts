import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message, MessagesService } from './services/messages.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  public messages: Array<Message> = [];
  public subscription: Subscription;

  constructor(
    private router: Router,
    private messagesService: MessagesService
  ) {}

  public ngOnInit(): void {
    this.router.navigate(['/welcome']);
    // Souscrit aux messages de messagesComponent
    this.subscription = this.messagesService
      .onMessage()
      .subscribe((messagesList: Array<Message>) => {
        this.messages = messagesList;
      });
    this.messagesService.emitMessage();
  }

  public ngOnDestroy(): void {
    // Annule la souscription pour éviter la fuite de mémoire
    this.subscription.unsubscribe();
  }
}
