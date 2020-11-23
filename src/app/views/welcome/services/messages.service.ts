import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }

  private subject = new Subject<{ text: string; }>();

    public sendMessage(message: string): void {
        this.subject.next({ text: message });
    }

    public clearMessages(): void {
        this.subject.next();
    }

    public onMessage(): Observable<{ text: string; }> {
        return this.subject.asObservable();
    }
}
