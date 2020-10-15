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
          this.figureService.pawnMoveCondition(
            square,
            figure.color,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.rook: {
        return board.filter((square: Square) =>
          this.figureService.rookMoveCondition(square, figureRow, figureColumn)
        );
      }
      case FigureName.bishop: {
        return board.filter((square: Square) =>
          this.figureService.bishopMoveCondition(
            square,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.king: {
        return board.filter((square: Square) =>
          this.figureService.kingMoveCondition(square, figureRow, figureColumn)
        );
      }
      case FigureName.queen: {
        return board.filter((square: Square) =>
          this.figureService.queenMoveCondition(square, figureRow, figureColumn)
        );
      }
      case FigureName.knight: {
        return board.filter((square: Square) =>
          this.figureService.knightMoveCondition(
            square,
            figureRow,
            figureColumn
          )
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

  public equalsPosition(position1: Position, position2: Position): boolean {
    return (
      position1.column.value === position2.column.value &&
      position1.row.value === position2.row.value
    );
  }
}
export interface Square {
  position: Position;
  color: Color;
  figure: Figure;
}
