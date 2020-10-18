import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FigureName } from 'src/app/board/services/figure.service';

@Component({
  selector: 'app-promotion-selection',
  templateUrl: './promotion-selection.component.html',
  styleUrls: ['./promotion-selection.component.scss'],
})
export class PromotionSelectionComponent implements OnInit {
  @Output()
  public promotionEmitter: EventEmitter<FigureName> = new EventEmitter<
    FigureName
  >();

  constructor() {}

  public ngOnInit(): void {}

  public selectFigure(figure: string): void {
    switch (figure) {
      case 'queen': {
        this.promotionEmitter.emit(FigureName.queen);
        break;
      }
      case 'rook': {
        this.promotionEmitter.emit(FigureName.rook);
        break;
      }
      case 'knight': {
        this.promotionEmitter.emit(FigureName.knight);
        break;
      }
      case 'bishop': {
        this.promotionEmitter.emit(FigureName.bishop);
        break;
      }
      default: {
        break;
      }
    }
  }
}
