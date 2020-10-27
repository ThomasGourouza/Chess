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
    // Les blancs commencent
    this.trait = Color.white;
  }

  public ngOnInit(): void {
    // Récupération des pieces
    this.figureService.initFigures(this.figures);
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard(this.figures, this.board);
    // Marquage des Tours pour distinguer celle de gauche de celle de droite
    // (utile pour le roque)
    this.board.map((square) => {
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
