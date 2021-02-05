import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  public text: string;
  public author: string;

  constructor(
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.author = 'Anon';
  }

  public ngOnInit(): void {}

  public clearMessages(): void {
    // Efface les messages
    this.messagesService.clearMessages();
    this.router.navigate(['/welcome']);
  }

  public onSubmit(form: NgForm): void {
    // Envoie le message aux 'subscribers' via l'observable 'messagesSubject'
    const text = form.value['text'];
    const author = form.value['author'];
    this.messagesService.sendMessage(text, author);
    this.router.navigate(['/welcome']);
  }
}
