import { Injectable } from '@angular/core';
import {
  Color,
  Figure,
  FigureName,
  FigureService,
  Position,
} from './figure.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private figureService: FigureService) {}

  public getBoard(): Array<Square> {
    const board = [];
    for (let row = 1; row <= 8; row++) {
      for (let column = 1; column <= 8; column++) {
        board.push({
          figure: null,
          color: (row + column) % 2 === 0 ? Color.black : Color.white,
          position: {
            column: {
              value: column,
              name: this.figureService.mapColomnValueToName(column),
            },
            row: { value: row, name: row.toString() },
          },
        });
      }
    }
    return board;
  }

  public resetBoardColors(board: Array<Square>): void {
    board.map((square) => {
      square.color =
        (square.position.row.value + square.position.column.value) % 2 === 0
          ? Color.black
          : Color.white;
    });
  }

  public colorPossibleSquares(board: Array<Square>): void {
    // Récupération de la case selectionnée
    const selectedSquare = board.find((s) => s.color === Color.blue);
    const selectedSquareRow = selectedSquare.position.row.value;
    const selectedSquareColumn = selectedSquare.position.column.value;
    // Récupération de la figure sélectionnée
    const figure = selectedSquare.figure;
    // this.resetBoardColors(board);
    switch (figure.name) {
      case FigureName.pawn: {
        board
          .filter(
            (square: Square) =>
              square.position.column.value === selectedSquareColumn &&
              [selectedSquareRow + 1, selectedSquareRow + 2].includes(
                square.position.row.value
              )
          )
          .map((square: Square) => {
            square.color = Color.green;
          });
        break;
      }
      default: {
        break;
      }
    }
  }
}
export interface Square {
  position: Position;
  color: Color;
  figure: Figure;
}
