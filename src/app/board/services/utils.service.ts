import { Injectable } from '@angular/core';
import { Square } from './board.service';
import { Position } from './figure.service';

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
}
