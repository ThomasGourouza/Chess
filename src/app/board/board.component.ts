import { Component, OnInit } from '@angular/core';
import { BoardService, Square } from './services/board.service';
import { Figure, FigureService } from './services/figure.service';
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

  constructor(
    private boardService: BoardService,
    private figureService: FigureService,
    private utilsService: UtilsService
  ) {
    // Initialisation des pieces
    this.figures = [];
    this.figureService.initFigures(this.figures);
    // Initialisation de l'échiquier
    this.board = this.boardService.getBoard();
  }

  public ngOnInit(): void {
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard(this.figures, this.board);
    // Initialisation de la pièce selectionnée
    this.selectedSquare = null;
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

  // TODO: remove
  public showSelectedSquare(): void {
    console.log(this.selectedSquare);
    console.log(this.board);
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
