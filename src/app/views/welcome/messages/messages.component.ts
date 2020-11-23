import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  public messageContent: string;
  constructor(private messagesService: MessagesService) {}

  public ngOnInit(): void {}

  public sendMessage(messageContent: string): void {
    // Envoie le message aux 'subscribers' via l'observable 'messagesSubject'
    this.messagesService.sendMessage(messageContent);
  }

  public clearMessages(): void {
    // Efface les messages
    this.messagesService.clearMessages();
  }
}
