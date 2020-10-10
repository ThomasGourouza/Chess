import { Injectable } from '@angular/core';
import { Color, Figure, FigureService, Position } from './figure.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private figureService: FigureService) {}

  getBoard(): Array<Square> {
    const board = [];
    for (let row = 1; row <= 8; row++) {
      for (let column = 1; column <= 8; column++) {
        board.push({
          figure: null,
          color: (row + column) % 2 === 0 ? Color.Black : Color.White,
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
}
export interface Square {
  position: Position;
  color: Color;
  figure: Figure;
}
