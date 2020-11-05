import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewGame, Score } from '../../board.component';
import { Square } from '../../services/board.service';
import { Color, FigureName } from '../../services/figure.service';
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
   * Affiche le message de fin de partie ou informe du trait
   */
  public infoText(): string {
    return this.isEndGame()
      ? this.endGameText
      : 'Trait aux ' + (this.trait === Color.black ? 'noirs' : 'blancs');
  }

  /**
   * Affiche les infos sur la pièce selectionnée (html)
   */
  public infoFigure(): string {
    let infoFigure =
      'Case ' +
      this.selectedSquare.position.column.name +
      this.selectedSquare.position.row.value +
      ': ' +
      this.figureToFrench(
        this.selectedSquare.figure.name,
        this.selectedSquare.figure.color
      );
    if (this.selectedSquare.figure.name != FigureName.king) {
      infoFigure += ' (' + this.selectedSquare.figure.value + ')';
    }
    return infoFigure;
  }

  /**
   * Affiche le nom de la pièce en français
   *
   * @param figureName
   * @param color
   */
  private figureToFrench(figureName: FigureName, color: Color): string {
    const isWhite = color === Color.white;
    switch (figureName) {
      case FigureName.pawn: {
        return isWhite ? 'Pion blanc' : 'Pion noir';
      }
      case FigureName.bishop: {
        return isWhite ? 'Fou blanc' : 'Fou noir';
      }
      case FigureName.rook: {
        return isWhite ? 'Tour blanche' : 'Tour noire';
      }
      case FigureName.knight: {
        return isWhite ? 'Cavalier blanc' : 'Cavalier noir';
      }
      case FigureName.queen: {
        return isWhite ? 'Dame blanche' : 'Dame noire';
      }
      case FigureName.king: {
        return isWhite ? 'Roi blanc' : 'Roi noir';
      }
    }
  }

  /**
   * Vérifie si la partie est terminée ou pas
   */
  public isEndGame(): boolean {
    return this.endGameText !== '';
  }
}
