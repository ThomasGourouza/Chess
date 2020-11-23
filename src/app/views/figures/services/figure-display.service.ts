import { Injectable } from '@angular/core';
import {
  Color,
  Figure,
  FigureCode,
  FigureName,
  FigureService,
} from '../../board/services/figure.service';
import { FigureDisplay, FrenchName } from '../figures.component';

@Injectable({
  providedIn: 'root',
})
export class FigureDisplayService {
  constructor(private figureService: FigureService) {}

  /**
   * Récupère une pièce selon son nom
   *
   * @param name
   */
  public getFiguresDisplayByName(name: FigureName): FigureDisplay {
    return this.getFiguresDisplay().find((figure) => figure.name === name);
  }

  /**
   * Transforme les données et supprime les doublons
   * @param figures
   */
  public getFiguresDisplay(): Array<FigureDisplay> {
    // renvoie les pièces transformées
    return this.removeDuplicate(
      this.mapFigures(this.figureService.initFigures())
    );
  }

  /**
   * Transforme les données
   *
   * @param figures
   */
  private mapFigures(figures: Array<Figure>): Array<FigureDisplay> {
    return figures.map((figure) => {
      return {
        value: figure.value,
        name: figure.name,
        frenchName: this.translateName(figure.name),
        code: figure.code,
      };
    });
  }

  /**
   * Traduit le nom d'une pièce
   *
   * @param figureName
   */
  public translateName(figureName: FigureName): FrenchName {
    let frenchName: FrenchName = null;
    for (const key in FigureName) {
      if (FigureName[key] === figureName) {
        frenchName = FrenchName[key];
      }
    }
    return frenchName;
  }

  /**
   * Supprime les doublons
   *
   * @param figuresDisplay
   */
  private removeDuplicate(
    figuresDisplay: Array<FigureDisplay>
  ): Array<FigureDisplay> {
    const noDuplicates: Array<FigureDisplay> = [];
    figuresDisplay.map((figure) => {
      if (
        !noDuplicates.some(
          (noDuplicatedFigure) => noDuplicatedFigure.code === figure.code
        )
      ) {
        noDuplicates.push(figure);
      }
    });
    return noDuplicates;
  }

  /**
   * Permet d'afficher l'image des pièces à l'ihm
   *
   * @param code
   */
  public getUrlOfFigure(code: FigureCode): string {
    const color: Color = Color.white;
    switch (code) {
      case FigureCode.pawn: {
        return color === Color.white
          ? 'assets/img/figures/WhitePawn.png'
          : 'assets/img/figures/BlackPawn.png';
      }
      case FigureCode.bishop: {
        return color === Color.white
          ? 'assets/img/figures/WhiteBishop.png'
          : 'assets/img/figures/BlackBishop.png';
      }
      case FigureCode.knight: {
        return color === Color.white
          ? 'assets/img/figures/WhiteKnight.png'
          : 'assets/img/figures/BlackKnight.png';
      }
      case FigureCode.rook: {
        return color === Color.white
          ? 'assets/img/figures/WhiteRook.png'
          : 'assets/img/figures/BlackRook.png';
      }
      case FigureCode.queen: {
        return color === Color.white
          ? 'assets/img/figures/WhiteQueen.png'
          : 'assets/img/figures/BlackQueen.png';
      }
      case FigureCode.king: {
        return color === Color.white
          ? 'assets/img/figures/WhiteKing.png'
          : 'assets/img/figures/BlackKing.png';
      }
    }
  }
}
