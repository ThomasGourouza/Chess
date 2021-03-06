import { Injectable } from '@angular/core';
import { Square } from './board.service';
import { Color, Figure, FigureName, Position } from './figure.service';
import { Move, Itinerary } from './history.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  /**
   * Méthode de copie d'un tableau de cases de l'échiquier
   *
   * @param squareGroup
   */
  public copyOf(squareGroup: Array<Square>): Array<Square> {
    const copy: Array<Square> = [];
    squareGroup.map((square) => {
      const copySquare: Square = {
        position: square.position,
        color: square.color,
        figure: square.figure,
      };
      copy.push(copySquare);
    });
    return copy;
  }

  /**
   * Renvoie la valeur absolue de la différence entre a et b
   *
   * @param a
   * @param b
   */
  public abs(a: number, b: number): number {
    return a > b ? a - b : b - a;
  }

  /**
   * Méthode de comparaison de deux positions
   *
   * @param position1
   * @param position2
   */
  public equalsPosition(position1: Position, position2: Position): boolean {
    return (
      position1.column.value === position2.column.value &&
      position1.row.value === position2.row.value
    );
  }

  /**
   * Méthode pour vérifier les coordonnées d'une case
   *
   * @param square
   * @param col
   * @param row
   */
  public isSquareAt(square: Square, col: number, row: number): boolean {
    return (
      square.position.column.value === col && square.position.row.value === row
    );
  }

  /**
   * Pour vérifier si une case est d'une certaine couleur
   * (c'est à dire d'un certain style css)
   *
   * @param squareColor
   * @param color
   */
  public isColored(squareColor: Color, color: string): boolean {
    let isColored = false;
    switch (color) {
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

  /**
   * Pour attribuer la couleur noire ou blanche aux cases
   *
   * @param square
   */
  public isBlackElseWhite(square: Square): boolean {
    return (square.position.row.value + square.position.column.value) % 2 === 0;
  }

  /**
   * Méthode de comparaison de deux moves
   *
   * @param moveOne
   * @param moveTwo
   */
  public equalsMove(moveOne: Move, moveTwo: Move): boolean {
    return (
      moveOne.id != moveTwo.id &&
      this.equalsItinerary(moveOne.whiteMove, moveTwo.whiteMove) &&
      ((moveOne.blackMove == null && moveTwo.blackMove == null) ||
        (moveOne.blackMove != null &&
          moveTwo.blackMove != null &&
          this.equalsItinerary(moveOne.blackMove, moveTwo.blackMove)))
    );
  }

  /**
   * Méthode de comparaison de deux itineraries
   *
   * @param itineraryOne
   * @param itineraryTwo
   */
  public equalsItinerary(
    itineraryOne: Itinerary,
    itineraryTwo: Itinerary
  ): boolean {
    return (
      this.equalsFigure(itineraryOne.figure, itineraryTwo.figure) &&
      this.equalsPosition(itineraryOne.origin, itineraryTwo.origin) &&
      this.equalsPosition(itineraryOne.target, itineraryTwo.target)
    );
  }

  /**
   * Méthode de comparaison de deux figures
   *
   * @param figureOne
   * @param figureTwo
   */
  public equalsFigure(figureOne: Figure, figureTwo: Figure): boolean {
    return (
      (figureOne == null && figureTwo == null) ||
      (figureOne != null &&
        figureTwo != null &&
        figureOne.code === figureTwo.code)
    );
  }

  /**
   * Renvoie un nombre aléatoire entre min (inclu) et max (exclu)
   *
   * @param min
   * @param max
   */
  public getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Renvoie un élément d'un tableau au hasard
   *
   * @param array
   */
  public getOneRandom(array: Array<any>): any {
    return array[this.getRandomInt(0, array.length)];
  }
}
