import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messages: Array<Message>;
  private messagesSubject = new Subject<Array<Message>>();

  constructor() {
    this.messages = [];
  }

  public onMessage(): Observable<Array<Message>> {
    return this.messagesSubject.asObservable();
  }

  public emitMessage(): void {
    this.messagesSubject.next(this.messages);
  }

  public sendMessage(messageContent: string): void {
    this.messages.push({ text: messageContent });
    this.emitMessage();
  }

  public clearMessages(): void {
    this.messages = [];
    this.emitMessage();
  }
}
export interface Message {
  text: string;
}
