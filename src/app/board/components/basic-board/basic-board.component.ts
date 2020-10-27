import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardService, Square } from '../../services/board.service';
import {
  Color,
  Figure,
  FigureName,
  FigureService,
} from '../../services/figure.service';
import { Itinerary, Move } from '../../services/history.service';
import { MoveConditionService } from '../../services/moveService/move-condition.service';
import { MoveService } from '../../services/moveService/Move.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-basic-board',
  templateUrl: './basic-board.component.html',
  styleUrls: ['./basic-board.component.scss'],
})
export class BasicBoardComponent implements OnInit {
  @Input()
  public board: Array<Square>;
  @Input()
  public trait: Color;
  @Input()
  public history: Array<Move>;
  @Output()
  public squareSelectEmitter: EventEmitter<Square> = new EventEmitter<Square>();
  @Output()
  public moveEmitter: EventEmitter<Itinerary> = new EventEmitter<Itinerary>();

  public originSquare: Square;
  public targetSquare: Square;
  public isPromotion: boolean;
  public moveForHistory: Itinerary;

  constructor(
    private boardService: BoardService,
    private figureService: FigureService,
    private moveService: MoveService,
    private moveConditionService: MoveConditionService,
    private utilsService: UtilsService
  ) {
    this.initSelectedSquares();
  }

  ngOnInit(): void {}

  private initSelectedSquares(): void {
    this.targetSquare = null;
    this.originSquare = null;
  }

  /**
   * Click sur une case de l'échiquier
   *
   * @param square
   */
  public onClick(square: Square): void {
    if (!this.isPromotion) {
      // deuxième click
      if (this.originSquare != null && this.originSquare.figure != null) {
        this.targetSquare = square;
        // Remise des couleurs d'origine des cases
        this.boardService.resetBoardColors(this.board);
        // Si la case sélectionnée est autorisée
        if (
          this.moveService
            .possibleSquares(this.originSquare.figure, this.board, this.history)
            .includes(this.targetSquare)
        ) {
          // Colore les cases d'origine et d'arrivée
          this.colorOriginAndTargetSquare();
          // Déplace la pièce sur l'échiquier
          this.moveFigureOnBoard(
            this.originSquare,
            this.targetSquare,
            this.board
          );
        } else {
          // Réinitialisation des cases d'arrivée et d'origine
          this.initSelectedSquares();
        }
        // premier click
      } else if (square.figure != null && square.figure.color === this.trait) {
        this.originSquare = square;
        this.board.find((s) =>
          this.utilsService.equalsPosition(s.position, square.position)
        ).color = Color.blue;
        // Colore les cases possibles
        this.boardService.colorPossibleSquares(
          this.originSquare.figure,
          this.board,
          this.history
        );
      }
      this.squareSelectEmitter.emit(this.originSquare);
    }
  }

  /**
   * Colore les cases de départ et d'arrivée
   *
   */
  public colorOriginAndTargetSquare(): void {
    this.board
      .filter(
        (square) =>
          this.utilsService.equalsPosition(
            square.position,
            this.originSquare.position
          ) ||
          this.utilsService.equalsPosition(
            square.position,
            this.targetSquare.position
          )
      )
      .map((square) => (square.color = Color.yellow));
  }

  /**
   * Méthode principale pour le déplacement des pièces
   *
   * @param originSquare
   * @param targetSquare
   * @param board
   */
  private moveFigureOnBoard(
    originSquare: Square,
    targetSquare: Square,
    board: Array<Square>
  ): void {
    // Récupération de la pièce selectionée
    const figure = originSquare.figure;
    // modification de l'attribut "position" de la pièce
    figure.position = targetSquare.position;
    // cas de la promotion du pion
    if (this.moveConditionService.promotionCondition(figure, targetSquare)) {
      // ouvre le composant de choix de la pièce de promotion
      this.isPromotion = true;
    } else {
      this.applyMoveFigureToSquare(figure, originSquare, targetSquare, board);
    }
  }

  /**
   * Provient de l'emmetteur de promotion
   * Permet de réaliser la promotion du pion
   *
   * @param promotionFigureName
   */
  public onPromotion(promotionFigureName: FigureName): void {
    // création de la pièce de promotion choisie
    const promotionFigure = this.figureService.getPromotionFigure(
      this.targetSquare.position.row.value,
      this.targetSquare.position.column.value,
      this.originSquare.figure.color,
      promotionFigureName
    );
    this.applyMoveFigureToSquare(
      promotionFigure,
      this.originSquare,
      this.targetSquare,
      this.board
    );
    // fermeture du composant de selection de promotion
    this.isPromotion = false;
  }

  /**
   * Applique le déplacement
   *
   * @param figure
   * @param originSquare
   * @param targetSquare
   * @param board
   */
  private applyMoveFigureToSquare(
    figureToMove: Figure,
    originSquare: Square,
    targetSquare: Square,
    board: Array<Square>
  ): void {
    // construction du coup à envoyer à l'historique
    this.moveForHistory = {
      figure: figureToMove,
      origin: originSquare.position,
      target: targetSquare.position,
    };
    // Envoi du coup à l'historique
    this.moveEmitter.emit(this.moveForHistory);
    // Cas de la prise en passant
    if (
      figureToMove.name === FigureName.pawn &&
      originSquare.position.column.value !==
        targetSquare.position.column.value &&
      targetSquare.figure == null
    ) {
      // capture du pion en passant (suppression du pion sur l'échiquier)
      board.find(
        (s) =>
          s.position.column.value === targetSquare.position.column.value &&
          s.position.row.value === originSquare.position.row.value
      ).figure = null;
    }
    // Suppression de la piece de la case de départ
    board.find((s) =>
      this.utilsService.equalsPosition(s.position, originSquare.position)
    ).figure = null;
    // Ajout de la pièce sur la case d'arrivée
    //TODO: capture
    board.find((s) =>
      this.utilsService.equalsPosition(s.position, targetSquare.position)
    ).figure = figureToMove;
    // Cas du roque
    if (
      figureToMove.name === FigureName.king &&
      this.utilsService.abs(
        originSquare.position.column.value,
        targetSquare.position.column.value
      ) === 2
    ) {
      const right = targetSquare.position.column.value === 7;
      const color = figureToMove.color;
      const rookSquare = board.find(
        (square) =>
          square.figure != null &&
          square.figure.name === FigureName.rook &&
          square.figure.color === color &&
          square.position.column.value === (right ? 8 : 1)
      );
      const rookToCastle = rookSquare.figure;
      // Suppression de la tour de sa case de départ
      rookSquare.figure = null;
      // Récupération de la case du roque pour la tour
      const castleSquareForRook = board.find((s) =>
        this.utilsService.isSquareAt(
          s,
          right ? 6 : 4,
          color === Color.white ? 1 : 8
        )
      );
      // Actualisation de la position de la tour
      rookToCastle.position = castleSquareForRook.position;
      // Ajout de la tour sur la case du roque
      castleSquareForRook.figure = rookToCastle;
    }
    // Réinitialisation des cases d'arrivée et d'origine
    this.initSelectedSquares();
  }

  /**
   * Pour afficher l'échiquier sur la page
   *
   * @param board
   */
  public mapBoardForDisplay(board: Array<Square>): Array<Array<Square>> {
    const boardToDisplay: Array<Array<Square>> = [];
    for (let rowIndex = 8; rowIndex >= 1; rowIndex--) {
      boardToDisplay.push(
        board
          .filter((square: Square) => square.position.row.value === rowIndex)
          .sort(
            (square1, square2) =>
              square1.position.column.value - square2.position.column.value
          )
      );
    }
    return boardToDisplay;
  }

  /**
   * Pour vérifier dans le html si une case est d'une certaine couleur
   *
   * @param squareColor
   * @param color
   */
  public isColored(squareColor: Color, color: string): boolean {
    return this.utilsService.isColored(squareColor, color);
  }
}
