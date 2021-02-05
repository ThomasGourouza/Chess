import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { UtilsService } from '../board/services/utils.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  public date: Date;
  public secondes: number;
  public counterSubscription: Subscription;
  public srcLogo: string;
  private srcLogoList: Array<string>;

  constructor(private utilsService: UtilsService, private router: Router) {
    // date du jour
    this.date = new Date();
    // temps de connexions
    this.secondes = 0;
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
  
  public ngOnInit(): void {
    // temps de connexion
    this.counterSubscription = interval(1000).subscribe((s: number) => {
      this.secondes = s + 1;
    });
  }

  public ngOnDestroy(): void {
    this.counterSubscription.unsubscribe();
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