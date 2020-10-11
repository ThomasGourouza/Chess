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
    this.initFigures();
    // Initialisation de l'échiquier
    this.board = this.boardService.getBoard();
    // Placement des pièces sur l'échiquier
    this.setFiguresOnBoard();
    // Initialisation de la pièce selectionnée
    this.selectedSquare = null;
  }

  // émetteur pour prendre en compte les changement de
  // selectedSquare dans les composants enfants
  public onSquareSelect(selectedSquare: Square): void {
    this.selectedSquare = selectedSquare;
  }

  public ngOnInit(): void {
    console.log(this.figures);
    console.log(this.board);
  }

  public showSelectedSquare(): void {
    console.log(this.selectedSquare);
  }

  private initFigures(): void {
    this.initPawns();
    this.initKnights();
    this.initBishops();
    this.initRooks();
    this.initQueens();
    this.initKings();
  }

  private setFiguresOnBoard(): void {
    this.figures.map((figure: Figure) => {
      this.board.find((square: Square) =>
        this.figureService.isFigureOnSquare(figure, square)
      ).figure = figure;
    });
  }

  private initPawns(): void {
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

  private initKnights(): void {
    // Les cavaliers noirs
    this.figures.push(this.figureService.getKnight(8, 2, Color.Black));
    this.figures.push(this.figureService.getKnight(8, 7, Color.Black));
    // Les cavaliers blancs
    this.figures.push(this.figureService.getKnight(1, 2, Color.White));
    this.figures.push(this.figureService.getKnight(1, 7, Color.White));
  }

  private initBishops(): void {
    // Les fous noirs
    this.figures.push(this.figureService.getBishop(8, 3, Color.Black));
    this.figures.push(this.figureService.getBishop(8, 6, Color.Black));
    // Les fous blancs
    this.figures.push(this.figureService.getBishop(1, 3, Color.White));
    this.figures.push(this.figureService.getBishop(1, 6, Color.White));
  }

  private initRooks(): void {
    // Les fous noirs
    this.figures.push(this.figureService.getRook(8, 1, Color.Black));
    this.figures.push(this.figureService.getRook(8, 8, Color.Black));
    // Les fous blancs
    this.figures.push(this.figureService.getRook(1, 1, Color.White));
    this.figures.push(this.figureService.getRook(1, 8, Color.White));
  }

  private initQueens(): void {
    // La dame noire
    this.figures.push(this.figureService.getQueen(8, 4, Color.Black));
    // La dame blanche
    this.figures.push(this.figureService.getQueen(1, 4, Color.White));
  }

  private initKings(): void {
    // Le roi noir
    this.figures.push(this.figureService.getKing(8, 5, Color.Black));
    // Le roi blanc
    this.figures.push(this.figureService.getKing(1, 5, Color.White));
  }
}
