import { Component, Input, OnInit } from '@angular/core';
import { Square } from '../../services/board.service';
import { Move } from '../../services/history.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input()
  public selectedSquare: Square;
  @Input()
  public history: Array<Move>;

  constructor(private utilsService: UtilsService) {}

  public ngOnInit(): void {}

  /**
   * Affiche le coup dand l'historique du html
   *
   * @param color
   */
  public printMove(isWhite: boolean, move: Move): string {
    const takes = ' ';
    const check = '';
    return isWhite
      ? move.whiteMove.figure.code +
          takes +
          move.whiteMove.target.column.name +
          move.whiteMove.target.row.name +
          check
      : move.blackMove != null
      ? move.blackMove.figure.code +
        takes +
        move.blackMove.target.column.name +
        move.blackMove.target.row.name +
        check
      : '';
  }
}
