import { Component, Input, OnInit } from '@angular/core';
import { FigureCode, Color } from '../../board/services/figure.service';
import { FigureDisplay } from '../figures.component';
import { FigureDisplayService } from '../services/figure-display.service';

@Component({
  selector: 'app-figure',
  templateUrl: './figure.component.html',
  styleUrls: ['./figure.component.scss']
})
export class FigureComponent implements OnInit {

  @Input()
  public figureDisplay: FigureDisplay;

  constructor(private figureDisplayService: FigureDisplayService) { }

  public ngOnInit(): void {
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
