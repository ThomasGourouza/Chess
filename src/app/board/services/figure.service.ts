import { Injectable } from '@angular/core';
import { Square } from './board.service';

@Injectable({
  providedIn: 'root',
})
export class FigureService {
  constructor() {}

  public getKnight(row: number, column: number, color: Color): Figure {
    return this.getFigure('knight', 3, row, column, color);
  }

  public getBishop(row: number, column: number, color: Color): Figure {
    return this.getFigure('bishop', 3, row, column, color);
  }

  public getRook(row: number, column: number, color: Color): Figure {
    return this.getFigure('rook', 5, row, column, color);
  }

  public getQueen(row: number, column: number, color: Color): Figure {
    return this.getFigure('queen', 9, row, column, color);
  }

  public getKing(row: number, column: number, color: Color): Figure {
    return this.getFigure('king', 1000, row, column, color);
  }

  private getFigure(
    name: string,
    value: number,
    row: number,
    column: number,
    color: Color
  ): Figure {
    const figure = this.getPawn(row, column, color);
    figure.value = value;
    figure.name = FigureName[name];
    figure.code = FigureCode[name];
    return figure;
  }

  public getPawn(row: number, column: number, color: Color): Figure {
    return {
      value: 1,
      name: FigureName.pawn,
      code: FigureCode.pawn,
      color: color,
      position: {
        column: {
          value: column,
          name: this.mapColomnValueToName(column),
        },
        row: {
          value: row,
          name: row.toString(),
        },
      },
    };
  }

  public mapColomnNameToValue(name: string): number {
    return [1, 2, 3, 4, 5, 6, 7, 8].find(
      (i) => this.mapColomnValueToName(i) === name
    );
  }

  public mapColomnValueToName(value: number): string {
    let name: string;
    switch (value) {
      case 1: {
        name = 'a';
        break;
      }
      case 2: {
        name = 'b';
        break;
      }
      case 3: {
        name = 'c';
        break;
      }
      case 4: {
        name = 'd';
        break;
      }
      case 5: {
        name = 'e';
        break;
      }
      case 6: {
        name = 'f';
        break;
      }
      case 7: {
        name = 'g';
        break;
      }
      case 8: {
        name = 'h';
        break;
      }
      default: {
        break;
      }
    }
    return name;
  }

  public pawnMoveCondition(
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

  public rookMoveCondition(
    square: Square,
    rookRow: number,
    rookColumn: number
  ): boolean {
    return (
      (square.position.column.value === rookColumn ||
        square.position.row.value === rookRow) &&
      (square.position.column.value !== rookColumn ||
        square.position.row.value !== rookRow)
    );
  }

  private subBishopMoveCondition(
    square: Square,
    bishopRow: number,
    bishopColumn: number,
    i: number
  ): boolean {
    return (
      (square.position.column.value === bishopColumn + i ||
        square.position.column.value === bishopColumn - i) &&
      (square.position.row.value === bishopRow + i ||
        square.position.row.value === bishopRow - i)
    );
  }

  public bishopMoveCondition(
    square: Square,
    bishopRow: number,
    bishopColumn: number
  ): boolean {
    let condition = false;
    for (let i = 1; i < 8; i++) {
      condition ||= this.subBishopMoveCondition(
        square,
        bishopRow,
        bishopColumn,
        i
      );
    }
    return condition;
  }

  public kingMoveCondition(
    square: Square,
    kingRow: number,
    kingColumn: number
  ): boolean {
    const colMove =
      square.position.column.value === kingColumn + 1 ||
      square.position.column.value === kingColumn - 1;
    const rowMove =
      square.position.row.value === kingRow + 1 ||
      square.position.row.value === kingRow - 1;
    return (
      (square.position.row.value === kingRow && colMove) ||
      (square.position.column.value === kingColumn && rowMove) ||
      (colMove && rowMove)
    );
  }

  public queenMoveCondition(
    square: Square,
    queenRow: number,
    queenColumn: number
  ): boolean {
    return (
      this.rookMoveCondition(square, queenRow, queenColumn) ||
      this.bishopMoveCondition(square, queenRow, queenColumn)
    );
  }

  public knightMoveCondition(
    square: Square,
    knightRow: number,
    knightColumn: number
  ): boolean {
    return (
      !this.queenMoveCondition(square, knightRow, knightColumn) &&
      square.position.row.value >= knightRow - 2 &&
      square.position.row.value <= knightRow + 2 &&
      square.position.column.value >= knightColumn - 2 &&
      square.position.column.value <= knightColumn + 2 &&
      (square.position.column.value !== knightColumn ||
        square.position.row.value !== knightRow)
    );
  }
}
export interface Figure {
  value: number;
  name: FigureName;
  code: FigureCode;
  color: Color;
  position: Position;
}
export enum Color {
  black = 'BLACK',
  white = 'WHITE',
  green = 'GREEN',
  red = 'RED',
  blue = 'BLUE',
  yellow = 'YELLOW'
}
export enum FigureName {
  pawn = 'PAWN',
  knight = 'KNIGHT',
  bishop = 'BISHOP',
  rook = 'ROOK',
  queen = 'QUEEN',
  king = 'KING',
}
export enum FigureCode {
  pawn = 'P',
  knight = 'N',
  bishop = 'B',
  rook = 'R',
  queen = 'Q',
  king = 'K',
}
export interface Position {
  column: Item;
  row: Item;
}
export interface Item {
  value: number;
  name: string;
}
