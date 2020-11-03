import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewGame, Score } from '../../board.component';
import { Square } from '../../services/board.service';
import { Color } from '../../services/figure.service';
import { Move } from '../../services/history.service';

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
  @Input()
  public trait: Color;
  @Input()
  public score: Score;
  @Input()
  public endGameText: string;
  @Output()
  public newGameEmitter: EventEmitter<NewGame> = new EventEmitter<NewGame>();

  constructor() {}

  public ngOnInit(): void {}

  /**
   * Pour commencer une nouvelle partie
   */
  public onNewGame(isAI: boolean): void {
    this.newGameEmitter.emit({
      isNewGame: confirm(
        isAI
          ? "Lancer une nouvelle partie contre l'IA ?"
          : 'Lancer une nouvelle partie ?'
      ),
      isAI: isAI,
    });
  }

  /**
   * Affiche le coup dans l'historique du html
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

  /**
   * Traduction pour affichage de la couleur du trait
   */
  public traitInFrench(): string {
    return this.trait === Color.black ? 'noirs' : 'blancs';
  }

  /**
   * Vérifie si la partie est terminée ou pas
   */
  public isEndGame(): boolean {
    return this.endGameText !== '';
  }
}
