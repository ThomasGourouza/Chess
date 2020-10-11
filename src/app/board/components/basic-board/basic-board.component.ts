import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardService, Square } from '../../services/board.service';
import { Color, Figure } from '../../services/figure.service';

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

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {}

  public onClick(square: Square): void {
    if (this.selectedSquare != null && this.selectedSquare.figure != null) {
      // Remise des couleurs d'origine des cases
      this.boardService.resetBoardColors(this.board);
      if (!this.equalSquares(this.selectedSquare, square)) {
        // Ajout de la pièce sur la case d'arrivée
        this.board.find((s) =>
          this.equalSquares(s, square)
        ).figure = this.selectedSquare.figure;
        // Suppression de la piece de la case de départ
        this.board.find((s) =>
          this.equalSquares(s, this.selectedSquare)
        ).figure = null;
      }
      // Réinitialisation de la case sélectionnée
      this.selectedSquare = null;
    } else if (square.figure != null) {
      this.selectedSquare = square;
      this.board.find((s) => this.equalSquares(s, square)).color = Color.Green;
    }
    this.squareSelectEmitter.emit(this.selectedSquare);
  }

  private equalSquares(square1: Square, square2: Square): boolean {
    return (
      square1.position.column.value === square2.position.column.value &&
      square1.position.row.value === square2.position.row.value
    );
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

  public isWhiteSquare(square: Square): boolean {
    return square.color === Color.White;
  }

  public isBlackSquare(square: Square): boolean {
    return square.color === Color.Black;
  }

  public isGreenSquare(square: Square): boolean {
    return square.color === Color.Green;
  }

  public isRedSquare(square: Square): boolean {
    return square.color === Color.Red;
  }

  public isWhiteFigure(figure: Figure): boolean {
    return figure.color === Color.White;
  }

  public isBlackFigure(figure: Figure): boolean {
    return figure.color === Color.Black;
  }
}
