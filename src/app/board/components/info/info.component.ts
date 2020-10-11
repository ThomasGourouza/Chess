import { Component, Input, OnInit } from '@angular/core';
import { Square } from '../../services/board.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input()
  public selectedSquare: Square;

  constructor() {}

  public ngOnInit(): void {}
}
