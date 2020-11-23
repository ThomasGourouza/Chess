import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthComponent } from './views/auth/auth.component';
import { BoardComponent } from './views/board/board.component';
import { BasicBoardComponent } from './views/board/components/basic-board/basic-board.component';
import { PromotionSelectionComponent } from './views/board/components/basic-board/promotion-selection/promotion-selection.component';
import { InfoComponent } from './views/board/components/info/info.component';
import { RouterModule, Routes } from '@angular/router';
import { FiguresComponent } from './views/figures/figures.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { AccountComponent } from './views/account/account.component';
import { FigureComponent } from './views/figures/figure/figure.component';
import { FigureDetailsComponent } from './views/figures/figure-details/figure-details.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard } from './views/auth/services/auth-guard.service';

const appRoutes: Routes = [
  { path: 'chess-board', canActivate: [AuthGuard], component: BoardComponent },
  { path: 'figures', canActivate: [AuthGuard], component: FiguresComponent },
  { path: 'figures/:name', canActivate: [AuthGuard], component: FigureDetailsComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'authentification', component: AuthComponent },
  { path: '', component: AuthComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    InfoComponent,
    BasicBoardComponent,
    PromotionSelectionComponent,
    AuthComponent,
    FiguresComponent,
    WelcomeComponent,
    AccountComponent,
    FigureComponent,
    FigureDetailsComponent,
    NotFoundComponent,
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
