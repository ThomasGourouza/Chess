import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FigureCode } from '../../board/services/figure.service';
import { FigureDisplay } from '../figures.component';
import { FigureDisplayService } from '../services/figure-display.service';

@Component({
  selector: 'app-figure-details',
  templateUrl: './figure-details.component.html',
  styleUrls: ['./figure-details.component.scss'],
})
export class FigureDetailsComponent implements OnInit {
  public figureDisplay: FigureDisplay;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private figureDisplayService: FigureDisplayService
  ) {}

  public ngOnInit(): void {
    // Après avoir cliqué sur une pièce (figure.component.html),
    // on navigue vers l'url figure/"name"
    // puis ici, on récupère ce "name" (défini dans app.module.ts)
    const name = this.activatedRoute.snapshot.params['name'];
    this.figureDisplay = this.figureDisplayService.getFiguresDisplayByName(
      name
    );
    if (!this.figureDisplay) {
      // redirige vers la page d'erreur 404
      this.router.navigate(['/not-found']);
    }
  }

  /**
   * Permet d'afficher l'image des pièces à l'ihm
   *
   * @param code
   */
  public getUrlOfFigure(code: FigureCode): string {
    return this.figureDisplayService.getUrlOfFigure(code);
  }
}
