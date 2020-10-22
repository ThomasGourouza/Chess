import { Injectable } from '@angular/core';
import { Figure, FigureName, Color } from '../figure.service';
import { Square } from '../board.service';
import { UtilsService } from '../utils.service';
import { MoveConditionService } from './move-condition.service';

@Injectable({
  providedIn: 'root',
})

/**
 * Service utilisé dans le service BoardService
 */
export class MoveService {
  constructor(
    private moveConditionService: MoveConditionService,
    private utilsService: UtilsService
  ) {}

  /**
   * Décrit les mouvements autorisés pour chaque pièce de l'échiquier
   *
   * @param figure
   * @param board
   */
  public possibleSquares(figure: Figure, board: Array<Square>): Array<Square> {
    return this.moveConstraintForFigure(
      figure,
      this.basicPossibleMovesForFigure(figure, board),
      board
    );
  }

  /**
   * Les mouvements de base pour chaque pièce
   *
   * @param figure
   * @param board
   */
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
          this.moveConditionService.pawnMoveCondition(
            square,
            figure.color,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.rook: {
        return board.filter((square: Square) =>
          this.moveConditionService.rookMoveCondition(
            square,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.bishop: {
        return board.filter((square: Square) =>
          this.moveConditionService.bishopMoveCondition(
            square,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.king: {
        return board.filter((square: Square) =>
          this.moveConditionService.kingMoveCondition(
            square,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.queen: {
        return board.filter((square: Square) =>
          this.moveConditionService.queenMoveCondition(
            square,
            figureRow,
            figureColumn
          )
        );
      }
      case FigureName.knight: {
        return board.filter((square: Square) =>
          this.moveConditionService.knightMoveCondition(
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

  /**
   * Gestion des mouvements autorisés pour chaque pièce
   *
   * @param figure
   * @param basicPossibleSquares
   * @param board
   */
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
        possibleSquares = this.applyConstraints(
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
        possibleSquares = this.applyConstraints(
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

  /**
   * Contraintes de mouvements des pièces:
   * interdit aux pièces de sauter par dessus les autres pièces
   *
   * @param figure
   * @param squareGroup
   * @param removedSquares
   */
  public applyConstraints(
    figure: Figure,
    squareGroup: Array<Square>,
    removedSquares: Array<Square>
  ): Array<Square> {
    let cleanedSquareGroup = this.utilsService.copyOf(squareGroup);
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
}
