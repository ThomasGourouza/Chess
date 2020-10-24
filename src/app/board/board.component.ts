import { Component, OnInit } from '@angular/core';
import { BoardService, Square } from './services/board.service';
import { Figure, FigureService } from './services/figure.service';
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
  }

  public ngOnInit(): void {
    // Récupération des pieces
    this.figureService.initFigures(this.figures);
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard(this.figures, this.board);
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
    this.historyService.addToHistory(this.history, moveForHistory);
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
