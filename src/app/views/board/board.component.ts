import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService, Square } from './services/board.service';
import { Color } from './services/figure.service';
import { HistoryService, Itinerary, Move } from './services/history.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public selectedSquare: Square;

  constructor(
    private boardService: BoardService,
    private historyService: HistoryService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.selectedSquare = null;
    // Remise des couleurs d'origine des cases
    this.boardService.resetBoardColors(this.boardService.board);
  }

  public ngOnDestroy(): void {
    if (
      this.boardService.endGameText === '' &&
      !confirm('Finir la partie plus tard ?')
    ) {
      this.router.navigate(['/chess-board']);
    }
  }

  /**
   * Récupération des variables du service (pour le html)
   */
  public getHistory(): Array<Move> {
    return this.boardService.history;
  }
  public getTrait(): Color {
    return this.boardService.trait;
  }
  public getScore(): Score {
    return this.boardService.score;
  }
  public getEndGameText(): string {
    return this.boardService.endGameText;
  }
  public getBoard(): Array<Square> {
    return this.boardService.board;
  }
  public getCpuMode(): boolean {
    return this.boardService.cpuMode;
  }

  /**
   * émetteur pour lancer une nouvelle partie
   *
   * @param selectedSquare
   */
  public onNewGame(newGame: NewGame): void {
    if (newGame.isNewGame) {
      // reinitialisation des variables du service
      this.boardService.onInit();
      // choix du mode
      this.boardService.cpuMode = newGame.isAI;
      this.selectedSquare = null;
    }
  }

  /**
   * émetteur pour la fin de la partie
   *
   * @param endGame
   */
  public onEndGame(endGame: EndGame): void {
    if (endGame.isWinnerWhite) {
      this.boardService.endGameText = 'Échec et mat! Victoire des blancs';
      this.boardService.score.white++;
    } else if (endGame.isWinnerBlack) {
      this.boardService.endGameText = 'Échec et mat! Victoire des Noirs';
      this.boardService.score.black++;
    } else {
      this.boardService.endGameText = 'Nulle!';
      this.boardService.score.white += 0.5;
      this.boardService.score.black += 0.5;
    }
  }

  /**
   * émetteur pour récupérer les changements de
   * selectedSquare dans les composants enfants
   *
   * @param selectedSquare
   */
  public onSquareSelect(selectedSquare: Square): void {
    this.selectedSquare = selectedSquare;
  }

  /**
   * émetteur pour ajouter un coup à l'historique de la partie
   *
   * @param history
   */
  public onMove(moveForHistory: Itinerary): void {
    // Ajouter un coup à l'historique de la partie
    this.historyService.addToHistory(this.boardService.history, moveForHistory);
    // determine à qui est-ce le tour de jouer
    this.boardService.trait =
      this.boardService.history[this.boardService.history.length - 1]
        .blackMove != null
        ? Color.white
        : Color.black;
  }
}
export interface EndGame {
  isWinnerWhite: boolean;
  isWinnerBlack: boolean;
}
export interface NewGame {
  isNewGame: boolean;
  isAI: boolean;
}
export interface Score {
  white: number;
  black: number;
}
