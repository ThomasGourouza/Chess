import { Component, Input } from '@angular/core';
import { Message } from '../../services/messages.service';

@Component({
  selector: 'app-message-display',
  templateUrl: './message-display.component.html',
  styleUrls: ['./message-display.component.scss']
})
export class MessageDisplayComponent {
  @Input()
  public message: Message;
}
