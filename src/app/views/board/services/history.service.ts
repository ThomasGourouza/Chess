import { Injectable } from '@angular/core';
import { Figure, Position } from './figure.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  /**
   * Ajouter un coup dans l'historique de la partie
   *
   * @param history
   * @param originMove
   * @param targetMove
   */
  public addToHistory(history: Array<Move>, moveForHistory: Itinerary): void {
    // création du coup
    const itinerary: Itinerary = {
      figure: moveForHistory.figure,
      origin: moveForHistory.origin,
      target: moveForHistory.target,
    };
    const moveForWhite: Move = {
      id: 1,
      whiteMove: itinerary,
      blackMove: null,
    };
    if (history.length === 0) {
      // premier coup
      history.push(moveForWhite);
    } else {
      // coups suivants
      const lastMove = history.find((move) => move.id === history.length);
      if (lastMove.blackMove == null) {
        // coup noir qui complète le tour
        lastMove.blackMove = itinerary;
      } else {
        // nouveau coup blanc
        moveForWhite.id = lastMove.id + 1;
        history.push(moveForWhite);
      }
    }
  }
}
export interface Move {
  id: number;
  whiteMove: Itinerary;
  blackMove: Itinerary;
}
export interface Itinerary {
  figure: Figure;
  origin: Position;
  target: Position;
}
