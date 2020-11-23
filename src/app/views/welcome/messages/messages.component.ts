import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  public message: string;
  constructor(private messagesService: MessagesService) {}

  public ngOnInit(): void {}

  public sendMessage(): void {
    // send message to subscribers via observable subject
    this.messagesService.sendMessage(this.message);
  }

  public clearMessages(): void {
    // clear messages
    this.messagesService.clearMessages();
  }
}
