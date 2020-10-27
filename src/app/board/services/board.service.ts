import { Injectable } from '@angular/core';
import { FigureService, Color, Figure, Position } from './figure.service';
import { Move } from './history.service';
import { MoveService } from './moveService/Move.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(
    private figureService: FigureService,
    private moveService: MoveService
  ) {}

  /**
   * Construction de l'échiquier
   *
   */
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

  /**
   * Réinitialisation des couleurs des cases de l'échiquier
   *
   * @param board
   */
  public resetBoardColors(board: Array<Square>): void {
    board.map((square) => {
      square.color =
        (square.position.row.value + square.position.column.value) % 2 === 0
          ? Color.black
          : Color.white;
    });
  }

  /**
   * Colore les cases de déplacement possibles d'une pièce sur l'échiquier
   *
   * @param figure
   * @param board
   */
  public colorPossibleSquares(
    figure: Figure,
    board: Array<Square>,
    history: Array<Move>
  ): void {
    // Coloration de toutes les cases de destination possibles
    this.moveService
      .possibleSquares(figure, board, history)
      .map((square: Square) => {
        square.color = Color.green;
      });
  }
}
export interface Square {
  position: Position;
  color: Color;
  figure: Figure;
}
