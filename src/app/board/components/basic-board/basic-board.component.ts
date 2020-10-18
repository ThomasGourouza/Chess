import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardService, Square } from '../../services/board.service';
import {
  Color,
  Figure,
  FigureName,
  FigureService,
} from '../../services/figure.service';

@Component({
  selector: 'app-basic-board',
  templateUrl: './basic-board.component.html',
  styleUrls: ['./basic-board.component.scss'],
})
export class BasicBoardComponent implements OnInit {
  @Input()
  public board: Array<Square>;
  @Output()
  public squareSelectEmitter: EventEmitter<Square> = new EventEmitter<Square>();

  public originSquare: Square;
  public targetSquare: Square;
  public isPromotion: boolean;

  constructor(
    private boardService: BoardService,
    private figureService: FigureService
  ) {}

  ngOnInit(): void {}

  private initSelectedSquares(): void {
    this.targetSquare = null;
    this.originSquare = null;
  }

  public onClick(square: Square): void {
    if (!this.isPromotion) {
      // deuxième click
      if (this.originSquare != null && this.originSquare.figure != null) {
        this.targetSquare = square;
        // Remise des couleurs d'origine des cases
        this.boardService.resetBoardColors(this.board);
        // Si la case sélectionnée est autorisée
        if (
          this.boardService
            .possibleSquares(this.originSquare.figure, this.board)
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
      } else if (square.figure != null) {
        this.originSquare = square;
        this.board.find((s) =>
          this.boardService.equalsPosition(s.position, square.position)
        ).color = Color.blue;
        // Colore les cases possibles
        this.boardService.colorPossibleSquares(
          this.originSquare.figure,
          this.board
        );
      }
      this.squareSelectEmitter.emit(this.originSquare);
    }
  }

  private promotionCondition(figure: Figure, targetSquare: Square): boolean {
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

  private getPromotionFigure(
    row: number,
    column: number,
    color: Color,
    figureName: FigureName
  ) {
    switch (figureName) {
      case FigureName.queen: {
        return this.figureService.getQueen(row, column, color);
      }
      case FigureName.bishop: {
        return this.figureService.getBishop(row, column, color);
      }
      case FigureName.knight: {
        return this.figureService.getKnight(row, column, color);
      }
      case FigureName.rook: {
        return this.figureService.getRook(row, column, color);
      }
    }
  }

  public colorOriginAndTargetSquare(): void {
    this.board
      .filter(
        (square) =>
          this.boardService.equalsPosition(
            square.position,
            this.originSquare.position
          ) ||
          this.boardService.equalsPosition(
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
    if (this.promotionCondition(figure, targetSquare)) {
      // ouvre le composant de choix de la pièce de promotion
      this.isPromotion = true;
    } else {
      this.subMoveFigureOnSquare(figure, originSquare, targetSquare, board);
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
    const promotionFigure = this.getPromotionFigure(
      this.targetSquare.position.row.value,
      this.targetSquare.position.column.value,
      this.originSquare.figure.color,
      promotionFigureName
    );
    this.subMoveFigureOnSquare(
      promotionFigure,
      this.originSquare,
      this.targetSquare,
      this.board
    );
    // fermeture du composant de selection de promotion
    this.isPromotion = false;
  }

  /**
   * Sous-méthode de déplacement
   *
   * @param figure
   * @param originSquare
   * @param targetSquare
   * @param board
   */
  private subMoveFigureOnSquare(
    figure: Figure,
    originSquare: Square,
    targetSquare: Square,
    board: Array<Square>
  ): void {
    // Suppression de la piece de la case de départ
    board.find((s) =>
      this.boardService.equalsPosition(s.position, originSquare.position)
    ).figure = null;
    // Ajout de la pièce sur la case d'arrivée
    board.find((s) =>
      this.boardService.equalsPosition(s.position, targetSquare.position)
    ).figure = figure;
    // Réinitialisation des cases d'arrivée et d'origine
    this.initSelectedSquares();
  }

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

  public isColored(squareColor: Color, color: string): boolean {
    let isColored = false;
    switch (color) {
      case 'white': {
        isColored = squareColor === Color.white;
        break;
      }
      case 'black': {
        isColored = squareColor === Color.black;
        break;
      }
      case 'green': {
        isColored = squareColor === Color.green;
        break;
      }
      case 'red': {
        isColored = squareColor === Color.red;
        break;
      }
      case 'blue': {
        isColored = squareColor === Color.blue;
        break;
      }
      case 'yellow': {
        isColored = squareColor === Color.yellow;
        break;
      }
      default: {
        break;
      }
    }
    return isColored;
  }
}
