import { Component, OnInit } from '@angular/core';
import { BoardService, Square } from './services/board.service';
import { Color, Figure, FigureService } from './services/figure.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public figures: Array<Figure>;
  public board: Array<Square>;
  public selectedSquare: Square;

  constructor(
    private boardService: BoardService,
    private figureService: FigureService
  ) {
    // Initialisation des pieces
    this.figures = [];
    this.initializePawns();
    this.initializeKnights();
    this.initializeBishops();
    this.initializeRooks();
    this.initializeQueens();
    this.initializeKings();
    // Initialisation de l'échiquier
    this.board = this.boardService.getBoard();
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard();
    // Initialisation de la pièce selectionnée
    this.selectedSquare = null;
  }

  public ngOnInit(): void {
    console.log(this.figures);
    console.log(this.board);
  }

  public isWhiteSquare(square: Square): boolean {
    return square.color === Color.White;
  }

  public isBlackSquare(square: Square): boolean {
    return square.color === Color.Black;
  }

  public isGreenSquare(square: Square): boolean {
    return square.color === Color.Green;
  }

  public isRedSquare(square: Square): boolean {
    return square.color === Color.Red;
  }

  public isWhiteFigure(figure: Figure): boolean {
    return figure.color === Color.White;
  }

  public isBlackFigure(figure: Figure): boolean {
    return figure.color === Color.Black;
  }

  public onClick(square: Square): void {
    if (this.selectedSquare != null && this.selectedSquare.figure != null) {
      // Remise des couleurs d'origine des cases
      this.boardService.resetBoardColors(this.board);
      if (!this.equalSquares(this.selectedSquare, square)) {
        // Ajout de la pièce sur la case d'arrivée
        this.board.find((s) =>
          this.equalSquares(s, square)
        ).figure = this.selectedSquare.figure;
        // Suppression de la piece de la case de départ
        this.board.find((s) =>
          this.equalSquares(s, this.selectedSquare)
        ).figure = null;
      }
      // Réinitialisation de la case sélectionnée
      this.selectedSquare = null;
    } else if (square.figure != null) {
      this.selectedSquare = square;
      this.board.find((s) => this.equalSquares(s, square)).color = Color.Green;
    }
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

  private initializePawns(): void {
    for (let index = 1; index <= 8; index++) {
      // Les pions noirs
      const blackPawn: Figure = this.figureService.getPawn(
        7,
        index,
        Color.Black
      );
      // Ajout à la liste des pièces
      this.figures.push(blackPawn);
      // Les pions Blancs
      const whitePawn: Figure = this.figureService.getPawn(
        2,
        index,
        Color.White
      );
      // Ajout à la liste des pièces
      this.figures.push(whitePawn);
    }
  }

  private initializeKnights(): void {
    // Les cavaliers noirs
    this.figures.push(this.figureService.getKnight(8, 2, Color.Black));
    this.figures.push(this.figureService.getKnight(8, 7, Color.Black));
    // Les cavaliers blancs
    this.figures.push(this.figureService.getKnight(1, 2, Color.White));
    this.figures.push(this.figureService.getKnight(1, 7, Color.White));
  }

  private initializeBishops(): void {
    // Les fous noirs
    this.figures.push(this.figureService.getBishop(8, 3, Color.Black));
    this.figures.push(this.figureService.getBishop(8, 6, Color.Black));
    // Les fous blancs
    this.figures.push(this.figureService.getBishop(1, 3, Color.White));
    this.figures.push(this.figureService.getBishop(1, 6, Color.White));
  }

  private initializeRooks(): void {
    // Les fous noirs
    this.figures.push(this.figureService.getRook(8, 1, Color.Black));
    this.figures.push(this.figureService.getRook(8, 8, Color.Black));
    // Les fous blancs
    this.figures.push(this.figureService.getRook(1, 1, Color.White));
    this.figures.push(this.figureService.getRook(1, 8, Color.White));
  }

  private initializeQueens(): void {
    // La dame noire
    this.figures.push(this.figureService.getQueen(8, 4, Color.Black));
    // La dame blanche
    this.figures.push(this.figureService.getQueen(1, 4, Color.White));
  }

  private initializeKings(): void {
    // Le roi noir
    this.figures.push(this.figureService.getKing(8, 5, Color.Black));
    // Le roi blanc
    this.figures.push(this.figureService.getKing(1, 5, Color.White));
  }

  private isFigureOnSquare(figure: Figure, square: Square): boolean {
    return (
      figure.isAlive &&
      figure.position.column.value === square.position.column.value &&
      figure.position.row.value === square.position.row.value
    );
  }

  private equalSquares(square1: Square, square2: Square): boolean {
    return (
      square1.position.column.value === square2.position.column.value &&
      square1.position.row.value === square2.position.row.value
    );
  }

  private setFiguresOnBoard(): void {
    this.figures.map((figure: Figure) => {
      this.board.find((square: Square) =>
        this.isFigureOnSquare(figure, square)
      ).figure = figure;
    });
  }
}
