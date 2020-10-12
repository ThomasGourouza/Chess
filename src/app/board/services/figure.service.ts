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
      isAlive: true,
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

  public isFigureOnSquare(figure: Figure, square: Square): boolean {
    return (
      figure.isAlive &&
      figure.position.column.value === square.position.column.value &&
      figure.position.row.value === square.position.row.value
    );
  }
}

export interface Figure {
  value: number;
  name: FigureName;
  code: FigureCode;
  color: Color;
  isAlive: boolean;
  position: Position;
}
export enum Color {
  black = 'BLACK',
  white = 'WHITE',
  green = 'GREEN',
  red = 'RED',
  blue = 'BLUE',
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
