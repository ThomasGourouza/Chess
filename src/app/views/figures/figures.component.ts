import { Component, OnInit } from '@angular/core';
import {
  FigureCode,
  FigureName,
} from '../board/services/figure.service';
import { FigureDisplayService } from './services/figure-display.service';

@Component({
  selector: 'app-figures',
  templateUrl: './figures.component.html',
  styleUrls: ['./figures.component.scss'],
})
export class FiguresComponent implements OnInit {
  public figuresDisplay: Array<FigureDisplay>;

  constructor(private figureDisplayService: FigureDisplayService) {
    this.figuresDisplay = [];
  }

  ngOnInit(): void {
    // Transformation des données pour passer au composant d'affichage
    this.figuresDisplay = this.figureDisplayService.getFiguresDisplay();
  }
}
export interface FigureDisplay {
  value: number;
  name: FigureName;
  frenchName: FrenchName;
  code: FigureCode;
}
export enum FrenchName {
  pawn = 'Pion',
  knight = 'Cavalier',
  bishop = 'Fou',
  rook = 'Tour',
  queen = 'Dame',
  king = 'Roi',
}
