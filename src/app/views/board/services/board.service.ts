import { Injectable } from '@angular/core';
import { Score } from '../board.component';
import { FigureService, Color, Figure, Position, Side } from './figure.service';
import { Move } from './history.service';
import { MoveService } from './moveService/Move.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private _board: Array<Square>;
  private _history: Array<Move>;
  private _trait: Color;
  private _score: Score;
  private _endGameText: string;
  private _cpuMode: boolean;

  get board(): Array<Square> {
    return this._board;
  }
  set board(value: Array<Square>) {
    this._board = value;
  }

  get history(): Array<Move> {
    return this._history;
  }
  set history(value: Array<Move>) {
    this._history = value;
  }

  get trait(): Color {
    return this._trait;
  }
  set trait(value: Color) {
    this._trait = value;
  }

  get score(): Score {
    return this._score;
  }
  set score(value: Score) {
    this._score = value;
  }

  get endGameText(): string {
    return this._endGameText;
  }
  set endGameText(value: string) {
    this._endGameText = value;
  }

  get cpuMode(): boolean {
    return this._cpuMode;
  }
  set cpuMode(value: boolean) {
    this._cpuMode = value;
  }

  constructor(
    private figureService: FigureService,
    private moveService: MoveService,
    private utilsService: UtilsService
  ) {
    this.onInit();    
    this.score = { white: 0, black: 0 };
    this.cpuMode = true;
  }

  public onInit(): void {
    this.board = this.getBoard();
    // nouvel historique
    this.history = [];
    // les blancs commencent
    this.trait = Color.white;
    this.endGameText = '';
  }

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
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard(this.figureService.initFigures(), board);
    // Marquage des Tours pour distinguer celle de gauche de celle de droite
    this.setRookIdentifiers(board);
    return board;
  }

  /**
   * Marquage des Tours pour distinguer celle de gauche de celle de droite
   * (utile pour le roque)
   *
   * @param board
   */
  private setRookIdentifiers(board: Array<Square>): void {
    board.map((square) => {
      if (
        this.utilsService.isSquareAt(square, 1, 1) ||
        this.utilsService.isSquareAt(square, 1, 8)
      ) {
        square.figure.side = Side.left;
      }
      if (
        this.utilsService.isSquareAt(square, 8, 1) ||
        this.utilsService.isSquareAt(square, 8, 8)
      ) {
        square.figure.side = Side.right;
      }
    });
  }

  /**
   * Place les pièces correctement sur l'échiquier
   *
   * @param figures
   * @param board
   */
  private setFiguresOnBoard(
    figures: Array<Figure>,
    board: Array<Square>
  ): void {
    figures.map((figure: Figure) => {
      board.find((square: Square) =>
        this.utilsService.equalsPosition(figure.position, square.position)
      ).figure = figure;
    });
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
      .possibleSquares(figure, board, history, true)
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
