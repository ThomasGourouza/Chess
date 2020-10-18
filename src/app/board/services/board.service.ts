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

  public basicPossibleMovesForFigure(
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

  private copyOf(squareGroup: Array<Square>): Array<Square> {
    const copy = [];
    squareGroup.map((square) => {
      copy.push(square);
    });
    return copy;
  }

  private cleanSquareGroup(
    figure: Figure,
    squareGroup: Array<Square>,
    removedSquares: Array<Square>
  ): Array<Square> {
    let cleanedSquareGroup = this.copyOf(squareGroup);
    removedSquares.map((square) => {
      const col = square.position.column.value;
      const row = square.position.row.value;
      const colRef = figure.position.column.value;
      const rowRef = figure.position.row.value;
      if (col > colRef) {
        if (row > rowRef) {
          // (x+, y+)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value > col && s.position.row.value > row)
          );
        } else if (row === rowRef) {
          // (x+, y=)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value > col && s.position.row.value === row)
          );
        } else {
          // (x+, y-)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value > col && s.position.row.value < row)
          );
        }
      } else if (col === colRef) {
        if (row > rowRef) {
          // (x=, y+)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value === col && s.position.row.value > row)
          );
        } else {
          // (x=, y-)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value === col && s.position.row.value < row)
          );
        }
      } else {
        if (row > rowRef) {
          // (x-, y+)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value < col && s.position.row.value > row)
          );
        } else if (row === rowRef) {
          // (x-, y=)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value < col && s.position.row.value === row)
          );
        } else {
          // (x-, y-)
          cleanedSquareGroup = cleanedSquareGroup.filter(
            (s) =>
              !(s.position.column.value < col && s.position.row.value < row)
          );
        }
      }
    });
    return cleanedSquareGroup;
  }

  public moveConstraintForFigure(
    figure: Figure,
    basicPossibleSquares: Array<Square>,
    board: Array<Square>
  ): Array<Square> {
    let possibleSquares = basicPossibleSquares.filter(
      (square) => square.figure == null || square.figure.color != figure.color
    );
    switch (figure.name) {
      case FigureName.pawn: {
        const pawnRow = figure.position.row.value;
        const pawnColumn = figure.position.column.value;
        const opponentFigureTakable = board.filter(
          (square) =>
            square.figure != null &&
            square.figure.color != figure.color &&
            // cas du pion blanc
            ((figure.color === Color.white &&
              square.position.row.value === pawnRow + 1) ||
              // cas du pion noir
              (figure.color === Color.black &&
                square.position.row.value === pawnRow - 1)) &&
            (square.position.column.value === pawnColumn + 1 ||
              square.position.column.value === pawnColumn - 1)
        );
        const possibleSquaresWithTake = possibleSquares
          .filter((square) => square.figure == null)
          .concat(opponentFigureTakable);
        const removedSquares = basicPossibleSquares.filter(
          (square) => !possibleSquares.includes(square)
        );
        possibleSquares = this.cleanSquareGroup(
          figure,
          possibleSquaresWithTake,
          removedSquares
        );
        break;
      }
      case FigureName.king: {
        // TODO
        break;
      }
      case FigureName.rook:
      case FigureName.bishop:
      case FigureName.queen: {
        const removedSquares = basicPossibleSquares.filter(
          (square) => !possibleSquares.includes(square)
        );
        const takableSquares = possibleSquares.filter(
          (square) => square.figure != null
        );
        takableSquares.map((square) => removedSquares.push(square));
        possibleSquares = this.cleanSquareGroup(
          figure,
          possibleSquares,
          removedSquares
        );
        break;
      }
      default: {
        break;
      }
    }
    return possibleSquares;
  }

  public possibleSquares(figure: Figure, board: Array<Square>): Array<Square> {
    return this.moveConstraintForFigure(
      figure,
      this.basicPossibleMovesForFigure(figure, board),
      board
    );
  }

  public colorPossibleSquares(figure: Figure, board: Array<Square>): void {
    // Coloration de toutes les cases de destination possibles
    this.possibleSquares(figure, board).map((square: Square) => {
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
