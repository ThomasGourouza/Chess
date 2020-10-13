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

  private pawnMoveCondition(
    square: Square,
    pawnColor: Color,
    pawnRow: number,
    pawnColumn: number
  ): boolean {
    return (
      (pawnColor === Color.black &&
        // pions noirs au départ
        ((pawnRow === 7 &&
          square.position.column.value === pawnColumn &&
          [pawnRow - 1, pawnRow - 2].includes(square.position.row.value)) ||
          // pions noirs déjà déplacés
          (pawnRow < 7 &&
            square.position.column.value === pawnColumn &&
            pawnRow - 1 === square.position.row.value))) ||
      (pawnColor === Color.white &&
        // pions blancs au départ
        ((pawnRow === 2 &&
          square.position.column.value === pawnColumn &&
          [pawnRow + 1, pawnRow + 2].includes(square.position.row.value)) ||
          // pions blancs déjà déplacés
          (pawnRow > 2 &&
            square.position.column.value === pawnColumn &&
            pawnRow + 1 === square.position.row.value)))
    );
  }

  public possibleSquaresForFigure(
    figure: Figure,
    board: Array<Square>
  ): Array<Square> {
    // Récupération des coordonnées de la pièce
    const figureRow = figure.position.row.value;
    const figureColumn = figure.position.column.value;
    switch (figure.name) {
      case FigureName.pawn: {
        return board.filter((square: Square) =>
          this.pawnMoveCondition(square, figure.color, figureRow, figureColumn)
        );
      }
      default: {
        return [];
      }
    }
  }

  public colorPossibleSquares(board: Array<Square>): void {
    // Récupération de la figure sélectionnée
    const figure = board.find((s) => s.color === Color.blue).figure;
    // Coloration de toutes les cases se destination possibles
    this.possibleSquaresForFigure(figure, board).map((square: Square) => {
      square.color = Color.green;
    });
  }
}
export interface Square {
  position: Position;
  color: Color;
  figure: Figure;
}
