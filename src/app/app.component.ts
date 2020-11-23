import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from './views/board/services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public srcLogo: string;
  private srcLogoList: Array<string>;

  constructor(private utilsService: UtilsService, private router: Router) {
    // initialisation du logo avec un cavalier
    this.srcLogo = 'assets/img/figures/WhiteKnight.png';
    // liste des pièces pour le logo
    this.srcLogoList = [
      'assets/img/figures/WhitePawn.png',
      'assets/img/figures/WhiteBishop.png',
      'assets/img/figures/WhiteKnight.png',
      'assets/img/figures/WhiteRook.png',
      'assets/img/figures/WhiteQueen.png',
      'assets/img/figures/WhiteKing.png',
    ];
  }
  /**
   * Permet de remplacer le logo par une pièce au hasard
   */
  public getRandomLogo(): void {
    this.srcLogo = this.utilsService.getOneRandom(this.srcLogoList);
  }

  /**
   * Redirige vers la page d'accueil
   */
  public goToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
}
