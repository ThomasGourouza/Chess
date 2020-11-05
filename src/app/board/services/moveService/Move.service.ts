import { Injectable } from '@angular/core';
import { Figure, FigureName, Color, Side } from '../figure.service';
import { Square } from '../board.service';
import { UtilsService } from '../utils.service';
import { MoveConditionService } from './move-condition.service';
import { Move } from '../history.service';
import { brotliDecompress } from 'zlib';

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
   * Réduit les possibilités de déplacement pour la sécurité du roi
   *
   * @param possibleSquares
   * @param king
   * @param board
   * @param history
   */
  public noSelfCheckConstraint(
    possibleSquares: Array<Square>,
    figure: Figure,
    board: Array<Square>,
    history: Array<Move>
  ): Array<Square> {
    return possibleSquares.filter((square) => {
      const figureMoved = {
        value: figure.value,
        name: figure.name,
        code: figure.code,
        color: figure.color,
        position: square.position,
      };
      // Création d'un faux échiquier pour chaque mouvement possible de la pièce
      const fakeBoard = this.utilsService.copyOf(board);
      // Suppression de la piece de la case de départ
      fakeBoard.find((s) =>
        this.utilsService.equalsPosition(s.position, figure.position)
      ).figure = null;
      // Ajout de la pièce sur la case d'arrivée
      fakeBoard.find((s) =>
        this.utilsService.equalsPosition(s.position, square.position)
      ).figure = figureMoved;
      return !fakeBoard.some(
        (s) =>
          s.figure != null &&
          s.figure.color != figure.color &&
          this.possibleSquares(s.figure, fakeBoard, history, false).some(
            (possibleSquare) => {
              const king =
                figure.name === FigureName.king
                  ? figureMoved
                  : board.find(
                      (s) =>
                        s.figure != null &&
                        s.figure.color === figure.color &&
                        s.figure.name === FigureName.king
                    ).figure;
              return this.utilsService.equalsPosition(
                possibleSquare.position,
                king.position
              );
            }
          )
      );
    });
  }

  /**
   * Permet d'identifier si il y a échec et mat sur l'échiquier
   *
   * @param board
   * @param color
   * @param history
   */
  public isCheckMate(
    board: Array<Square>,
    color: Color,
    history: Array<Move>
  ): boolean {
    return (
      this.isCheck(board, color) &&
      !this.isPossibleToMove(board, color, history)
    );
  }

  /**
   * Permet d'identifier si il y a pat
   *
   * @param board
   * @param color
   * @param history
   */
  public isPat(
    board: Array<Square>,
    color: Color,
    history: Array<Move>
  ): boolean {
    return (
      !this.isCheck(board, color) &&
      !this.isPossibleToMove(board, color, history)
    );
  }

  /**
   * Permet d'identifier si il y a échec
   *
   * @param board
   * @param color
   */
  private isCheck(board: Array<Square>, color: Color): boolean {
    return board.find(
      (square) =>
        square.figure != null &&
        square.figure.color === color &&
        square.figure.name === FigureName.king
    ).figure.isCheck;
  }

  /**
   * Permet d'identifier si il y a des possibilités de mouvement
   *
   * @param board
   * @param color
   * @param history
   */
  private isPossibleToMove(
    board: Array<Square>,
    color: Color,
    history: Array<Move>
  ): boolean {
    return board
      .filter(
        (square) => square.figure != null && square.figure.color === color
      )
      .some(
        (square) =>
          this.possibleSquares(square.figure, board, history, true).length > 0
      );
  }

  /**
   * Valorise l'attribut permettant de savoir si le roi est en échec
   *
   * @param board
   * @param history
   */
  public setCheck(board: Array<Square>, history: Array<Move>): void {
    board
      .filter(
        (square) =>
          square.figure != null && square.figure.name === FigureName.king
      )
      .map((kingSquare) => {
        kingSquare.figure.isCheck = board
          .filter((s) => s.figure != null)
          .some((s) =>
            this.possibleSquares(
              s.figure,
              board,
              history,
              false
            ).some((possibleSquare) =>
              this.utilsService.equalsPosition(
                possibleSquare.position,
                kingSquare.position
              )
            )
          );
      });
  }

  /**
   * Décrit les mouvements autorisés pour chaque pièce de l'échiquier
   *
   * @param figure
   * @param board
   */
  public possibleSquares(
    figure: Figure,
    board: Array<Square>,
    history: Array<Move>,
    kingSafety: boolean
  ): Array<Square> {
    return this.moveConstraintForFigure(
      figure,
      this.basicPossibleMovesForFigure(figure, board),
      board,
      history,
      kingSafety
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
    board: Array<Square>,
    history: Array<Move>,
    kingSafety: boolean
  ): Array<Square> {
    let possibleSquares = basicPossibleSquares.filter(
      (square) => square.figure == null || square.figure.color != figure.color
    );
    switch (figure.name) {
      case FigureName.pawn: {
        // prise en passant
        let enPassantSquare: Square = null;
        // cas du pion blanc
        if (figure.color === Color.white && figure.position.row.value === 5) {
          const PreviousBlackMove = history[history.length - 1].blackMove;
          if (
            PreviousBlackMove != null &&
            PreviousBlackMove.figure != null &&
            PreviousBlackMove.figure.name === FigureName.pawn &&
            PreviousBlackMove.origin.row.value === 7 &&
            PreviousBlackMove.target.row.value === 5
          ) {
            enPassantSquare = board.find(
              (s) =>
                s.position.column.value ===
                  PreviousBlackMove.target.column.value &&
                s.position.row.value === 6
            );
          }
        }
        // cas du pion noir
        if (figure.color === Color.black && figure.position.row.value === 4) {
          const PreviousWhiteMove = history[history.length - 1].whiteMove;
          if (
            PreviousWhiteMove.figure.name === FigureName.pawn &&
            PreviousWhiteMove.origin.row.value === 2 &&
            PreviousWhiteMove.target.row.value === 4
          ) {
            enPassantSquare = board.find(
              (s) =>
                s.position.column.value ===
                  PreviousWhiteMove.target.column.value &&
                s.position.row.value === 3
            );
          }
        }
        // prise normale
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
        // contrainte de l'avancée de deux cases au début
        board
          .filter(
            (s) =>
              s.figure != null &&
              s.position.column.value === figure.position.column.value &&
              ((figure.color === Color.white &&
                figure.position.row.value === 2 &&
                s.position.row.value === figure.position.row.value + 1) ||
                (figure.color === Color.black &&
                  figure.position.row.value === 7 &&
                  s.position.row.value === figure.position.row.value - 1))
          )
          .map((s) => removedSquares.push(s));
        possibleSquares = this.applyConstraints(
          figure,
          possibleSquaresWithTake,
          removedSquares
        );
        if (enPassantSquare != null) {
          possibleSquares.push(enPassantSquare);
        }
        break;
      }
      case FigureName.king: {
        const castleSquares: Array<Square> = [];
        // Roque roi blanc à droite
        if (
          figure.color === Color.white &&
          !this.moveConditionService.hasFigureAlreadyMoved(
            FigureName.king,
            history,
            Color.white,
            null
          )
        ) {
          // à droite
          if (
            this.moveConditionService.areSquaresForCastleEmpty(
              board,
              Color.white,
              true
            ) &&
            !this.moveConditionService.hasFigureAlreadyMoved(
              FigureName.rook,
              history,
              Color.white,
              Side.right
            )
          ) {
            castleSquares.push(
              board.find((s) => this.utilsService.isSquareAt(s, 7, 1))
            );
          }
          // à gauche
          if (
            this.moveConditionService.areSquaresForCastleEmpty(
              board,
              Color.white,
              false
            ) &&
            !this.moveConditionService.hasFigureAlreadyMoved(
              FigureName.rook,
              history,
              Color.white,
              Side.left
            )
          ) {
            castleSquares.push(
              board.find((s) => this.utilsService.isSquareAt(s, 3, 1))
            );
          }
        }
        // Roque roi noir à droite
        if (
          figure.color === Color.black &&
          !this.moveConditionService.hasFigureAlreadyMoved(
            FigureName.king,
            history,
            Color.black,
            null
          )
        ) {
          // à droite
          if (
            this.moveConditionService.areSquaresForCastleEmpty(
              board,
              Color.black,
              true
            ) &&
            !this.moveConditionService.hasFigureAlreadyMoved(
              FigureName.rook,
              history,
              Color.black,
              Side.right
            )
          ) {
            castleSquares.push(
              board.find((s) => this.utilsService.isSquareAt(s, 7, 8))
            );
          }
          // à gauche
          if (
            this.moveConditionService.areSquaresForCastleEmpty(
              board,
              Color.black,
              false
            ) &&
            !this.moveConditionService.hasFigureAlreadyMoved(
              FigureName.rook,
              history,
              Color.black,
              Side.left
            )
          ) {
            castleSquares.push(
              board.find((s) => this.utilsService.isSquareAt(s, 3, 8))
            );
          }
        }
        if (castleSquares.length > 0) {
          castleSquares.map((s) => {
            possibleSquares.push(s);
          });
        }
        // intedit au roi de roquer en traversant des cases ataquées
        possibleSquares = kingSafety
          ? this.noSelfCheckConstraint(possibleSquares, figure, board, history)
          : possibleSquares;
        const basicPossibleSquaresOfKing = basicPossibleSquares.filter(
          (square) =>
            square.figure == null || square.figure.color != figure.color
        );
        const removedSquares = basicPossibleSquaresOfKing.filter(
          (s) => !possibleSquares.includes(s)
        );
        possibleSquares = this.applyConstraints(
          figure,
          possibleSquares,
          removedSquares
        );
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
    return kingSafety
      ? this.noSelfCheckConstraint(possibleSquares, figure, board, history)
      : possibleSquares;
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
    let cleanedSquareGroup = squareGroup;
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
