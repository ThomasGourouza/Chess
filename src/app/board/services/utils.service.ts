import { Injectable } from '@angular/core';
import { Square } from './board.service';
import { Color, Position } from './figure.service';

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
    const copy = [];
    squareGroup.map((square) => {
      copy.push(square);
    });
    return copy;
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
   * Pour vérifier si une case est d'une certaine couleur
   *
   * @param squareColor
   * @param color
   */
  public isColored(squareColor: Color, color: string): boolean {
    let isColored = false;
    switch (color) {
      case 'white': {
        isColored = squareColor === Color.white;
        break;
      }
      case 'black': {
        isColored = squareColor === Color.black;
        break;
      }
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
}
