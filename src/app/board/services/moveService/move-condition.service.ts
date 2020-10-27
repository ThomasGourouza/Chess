import { Injectable } from '@angular/core';
import { Color, Figure, FigureName, Side } from '../figure.service';
import { Square } from '../board.service';
import { Move } from '../history.service';

@Injectable({
  providedIn: 'root',
})
export class MoveConditionService {
  constructor() {}

  /**
   * Condition pour la promotion du pion
   *
   * @param figure
   *
   * @param targetSquare
   */
  public promotionCondition(figure: Figure, targetSquare: Square): boolean {
    // cas du pion blanc
    const whitePawnCondition =
      figure.color === Color.white && targetSquare.position.row.value === 8;
    // cas du pion noir
    const blackPawnCondition =
      figure.color === Color.black && targetSquare.position.row.value === 1;
    return (
      figure.name === FigureName.pawn &&
      (whitePawnCondition || blackPawnCondition)
    );
  }

  /**
   * Méthodes utilitaires pour le roque
   *
   */

  public hasFigureAlreadyMoved(
    figureName: FigureName,
    history: Array<Move>,
    color: Color,
    side: Side
  ): boolean {
    return history.some((move) => {
      const figure =
        color === Color.white
          ? move.whiteMove.figure
          : move.blackMove != null
          ? move.blackMove.figure
          : null;
      return (
        figure != null &&
        figure.name === figureName &&
        (side != null ? figure.side === side : true)
      );
    });
  }
  public areSquaresForCastleEmpty(
    board: Array<Square>,
    color: Color,
    right: boolean
  ): boolean {
    const cols: Array<number> = right ? [6, 7] : [3, 4];
    return !board
      .filter(
        (square) =>
          square.position.row.value === (color === Color.white ? 1 : 8) &&
          cols.includes(square.position.column.value)
      )
      .some((square) => square.figure != null);
  }

  /**
   * Conditions de déplacement pour chaque pièce
   *
   */

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
