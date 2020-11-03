import { Component, OnInit } from '@angular/core';
import { BoardService, Square } from './services/board.service';
import { Color, Figure, FigureService, Side } from './services/figure.service';
import { HistoryService, Itinerary, Move } from './services/history.service';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public figures: Array<Figure>;
  public board: Array<Square>;
  public selectedSquare: Square;
  public history: Array<Move>;
  public trait: Color;
  public score: Score;
  public endGameText: string;
  public cpuMode: boolean;

  constructor(
    private boardService: BoardService,
    private figureService: FigureService,
    private historyService: HistoryService,
    private utilsService: UtilsService
  ) {
    this.figures = [];
    this.board = this.boardService.getBoard();
    this.selectedSquare = null;
    this.history = [];
    this.score = { white: 0, black: 0 };
    this.endGameText = '';
    // Les blancs commencent
    this.trait = Color.white;
    this.cpuMode = true;
  }

  public ngOnInit(): void {
    // Récupération des pieces
    this.figureService.initFigures(this.figures);
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard(this.figures, this.board);
    // Marquage des Tours pour distinguer celle de gauche de celle de droite
    this.setRookIdentifiers(this.board);
  }

  /**
   * émetteur pour lancer une nouvelle partie
   *
   * @param selectedSquare
   */
  public onNewGame(newGame: boolean): void {
    if (newGame) {
      this.endGameText = '';
      this.figures = [];
      this.board = this.boardService.getBoard();
      this.selectedSquare = null;
      // Les blancs commencent
      this.trait = Color.white;
      // nouvel historique
      this.history = [];
      // Récupération des pieces
      this.figureService.initFigures(this.figures);
      // Placement des pièces sur l'échiquier
      this.setFiguresOnBoard(this.figures, this.board);
      // Marquage des Tours pour distinguer celle de gauche de celle de droite
      this.setRookIdentifiers(this.board);
      this.cpuMode = confirm("Jouer contre l'intelligence artificielle?");
    }
  }

  /**
   * émetteur pour la fin de la partie
   *
   * @param endGame
   */
  public onEndGame(endGame: EndGame): void {
    if (endGame.isWinnerWhite) {
      this.endGameText = 'Échec et mat! Victoire des blancs';
      this.score.white++;
    } else if (endGame.isWinnerBlack) {
      this.endGameText = 'Échec et mat! Victoire des Noirs';
      this.score.black++;
    } else {
      this.endGameText = 'Nulle!';
      this.score.white += 0.5;
      this.score.black += 0.5;
    }
  }

  /**
   * Marquage des Tours pour distinguer celle de gauche de celle de droite
   * (utile pour le roque)
   *
   * @param board
   */
  public setRookIdentifiers(board: Array<Square>): void {
    board.map((square) => {
      if (
        this.utilsService.isSquareAt(square, 1, 1) ||
        this.utilsService.isSquareAt(square, 1, 8)
      ) {
        square.figure.side = Side.left;
      }
      if (
        this.utilsService.isSquareAt(square, 8, 1) ||
        this.utilsService.isSquareAt(square, 8, 8)
      ) {
        square.figure.side = Side.right;
      }
    });
  }

  /**
   * émetteur pour récupérer les changements de
   * selectedSquare dans les composants enfants
   *
   * @param selectedSquare
   */
  public onSquareSelect(selectedSquare: Square): void {
    this.selectedSquare = selectedSquare;
  }

  /**
   * émetteur pour ajouter un coup à l'historique de la partie
   *
   * @param history
   */
  public onMove(moveForHistory: Itinerary): void {
    // Ajouter un coup à l'historique de la partie
    this.historyService.addToHistory(this.history, moveForHistory);
    // determine à qui est-ce le tour de jouer
    this.trait =
      this.history[this.history.length - 1].blackMove != null
        ? Color.white
        : Color.black;
  }

  private setFiguresOnBoard(
    figures: Array<Figure>,
    board: Array<Square>
  ): void {
    figures.map((figure: Figure) => {
      board.find((square: Square) =>
        this.utilsService.equalsPosition(figure.position, square.position)
      ).figure = figure;
    });
  }
}
export interface EndGame {
  isWinnerWhite: boolean;
  isWinnerBlack: boolean;
}
export interface Score {
  white: number;
  black: number;
}
