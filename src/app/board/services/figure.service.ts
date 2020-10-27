import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FigureService {
  constructor() {}

  /**
   * Méthode d'initialisation des pièces
   *
   * @param figures
   */
  public initFigures(figures: Array<Figure>): void {
    this.initPawns(figures);
    this.initKnights(figures);
    this.initBishops(figures);
    this.initRooks(figures);
    this.initQueens(figures);
    this.initKings(figures);
  }

  /**
   * Méthodes de récupération de chaque pièce
   *
   */

  public initPawns(figures: Array<Figure>): void {
    for (let index = 1; index <= 8; index++) {
      // Les pions noirs
      const blackPawn: Figure = this.getPawn(7, index, Color.black);
      // Ajout à la liste des pièces
      figures.push(blackPawn);
      // Les pions Blancs
      const whitePawn: Figure = this.getPawn(2, index, Color.white);
      // Ajout à la liste des pièces
      figures.push(whitePawn);
    }
  }

  public initKnights(figures: Array<Figure>): void {
    // Les cavaliers noirs
    figures.push(this.getKnight(8, 2, Color.black));
    figures.push(this.getKnight(8, 7, Color.black));
    // Les cavaliers blancs
    figures.push(this.getKnight(1, 2, Color.white));
    figures.push(this.getKnight(1, 7, Color.white));
  }

  public initBishops(figures: Array<Figure>): void {
    // Les fous noirs
    figures.push(this.getBishop(8, 3, Color.black));
    figures.push(this.getBishop(8, 6, Color.black));
    // Les fous blancs
    figures.push(this.getBishop(1, 3, Color.white));
    figures.push(this.getBishop(1, 6, Color.white));
  }

  public initRooks(figures: Array<Figure>): void {
    // Les fous noirs
    figures.push(this.getRook(8, 1, Color.black));
    figures.push(this.getRook(8, 8, Color.black));
    // Les fous blancs
    figures.push(this.getRook(1, 1, Color.white));
    figures.push(this.getRook(1, 8, Color.white));
  }

  public initQueens(figures: Array<Figure>): void {
    // La dame noire
    figures.push(this.getQueen(8, 4, Color.black));
    // La dame blanche
    figures.push(this.getQueen(1, 4, Color.white));
  }

  public initKings(figures: Array<Figure>): void {
    // Le roi noir
    figures.push(this.getKing(8, 5, Color.black));
    // Le roi blanc
    figures.push(this.getKing(1, 5, Color.white));
  }

  /**
   * Méthodes de création des pièces
   *
   */

  public getPromotionFigure(
    row: number,
    column: number,
    color: Color,
    figureName: FigureName
  ): Figure {
    switch (figureName) {
      case FigureName.queen: {
        return this.getQueen(row, column, color);
      }
      case FigureName.bishop: {
        return this.getBishop(row, column, color);
      }
      case FigureName.knight: {
        return this.getKnight(row, column, color);
      }
      case FigureName.rook: {
        return this.getRook(row, column, color);
      }
    }
  }

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

  /**
   * Méthode de mapping de l'attribut "position" pour affichage
   *
   */
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
}
export interface Figure {
  value: number;
  name: FigureName;
  code: FigureCode;
  color: Color;
  position: Position;
  side?: Side;
}
export enum Color {
  black = 'BLACK',
  white = 'WHITE',
  green = 'GREEN',
  red = 'RED',
  blue = 'BLUE',
  yellow = 'YELLOW',
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
export enum Side {
  right = 'R',
  left = 'L',
}
