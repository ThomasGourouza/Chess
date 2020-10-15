import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardService, Square } from '../../services/board.service';
import { Color } from '../../services/figure.service';

@Component({
  selector: 'app-basic-board',
  templateUrl: './basic-board.component.html',
  styleUrls: ['./basic-board.component.scss'],
})
export class BasicBoardComponent implements OnInit {
  @Input()
  public board: Array<Square>;
  @Input()
  public selectedSquare: Square;
  @Output()
  public squareSelectEmitter: EventEmitter<Square> = new EventEmitter<Square>();

  public test: string;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {}

  public onClick(square: Square): void {
    // deuxième click
    if (this.selectedSquare != null && this.selectedSquare.figure != null) {
      // Remise des couleurs d'origine des cases
      this.boardService.resetBoardColors(this.board);
      // Si la case sélectionnée est autorisée
      if (
        this.boardService
          .possibleSquaresForFigure(this.selectedSquare.figure, this.board)
          .includes(square)
      ) {
        this.moveFigureOnBoard(this.selectedSquare, square, this.board);
      }
      // Réinitialisation de la case sélectionnée
      this.selectedSquare = null;
      // premier click
    } else if (square.figure != null) {
      this.selectedSquare = square;
      this.board.find((s) =>
        this.boardService.equalsPosition(s.position, square.position)
      ).color = Color.blue;
      // Colore les cases possibles
      this.boardService.colorPossibleSquares(this.board);
    }
    this.squareSelectEmitter.emit(this.selectedSquare);
  }

  private moveFigureOnBoard(
    originSquare: Square,
    targetSquare: Square,
    board: Array<Square>
  ): void {
    // Récupération de la pièce selectionée
    const figure = originSquare.figure;
    // modification de l'attribut "position" de la pièce
    figure.position = targetSquare.position;
    // Ajout de la pièce sur la case d'arrivée
    board.find((s) =>
      this.boardService.equalsPosition(s.position, targetSquare.position)
    ).figure = figure;
    // Suppression de la piece de la case de départ
    board.find((s) =>
      this.boardService.equalsPosition(s.position, originSquare.position)
    ).figure = null;
  }

  public mapBoardForDisplay(board: Array<Square>): Array<Array<Square>> {
    const boardToDisplay: Array<Array<Square>> = [];
    for (let rowIndex = 8; rowIndex >= 1; rowIndex--) {
      boardToDisplay.push(
        board
          .filter((square: Square) => square.position.row.value === rowIndex)
          .sort(
            (square1, square2) =>
              square1.position.column.value - square2.position.column.value
          )
      );
    }
    return boardToDisplay;
  }

  public isColored(squareColor: Color, color: string): boolean {
    let isColored = false;
    switch (color) {
      case 'white': {
        isColored = squareColor === Color.white;
        break;
      }
      case 'black': {
        isColored = squareColor === Color.black;
        break;
      }
      case 'green': {
        isColored = squareColor === Color.green;
        break;
      }
      case 'red': {
        isColored = squareColor === Color.red;
        break;
      }
      case 'blue': {
        isColored = squareColor === Color.blue;
        break;
      }
      default: {
        break;
      }
    }
    return isColored;
  }
}
