import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { InfoComponent } from './board/components/info/info.component';
import { BasicBoardComponent } from './board/components/basic-board/basic-board.component';
import { PromotionSelectionComponent } from './board/components/basic-board/promotion-selection/promotion-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    InfoComponent,
    BasicBoardComponent,
    PromotionSelectionComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
