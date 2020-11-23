import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './views/account/account.component';
import { AuthComponent } from './views/auth/auth.component';
import { AuthGuard } from './views/auth/services/auth-guard.service';
import { BoardComponent } from './views/board/board.component';
import { FigureDetailsComponent } from './views/figures/figure-details/figure-details.component';
import { FiguresComponent } from './views/figures/figures.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { WelcomeComponent } from './views/welcome/welcome.component';

const routes: Routes = [
  { path: 'chess-board', canActivate: [AuthGuard], component: BoardComponent },
  { path: 'figures', canActivate: [AuthGuard], component: FiguresComponent },
  {
    path: 'figures/:name',
    canActivate: [AuthGuard],
    component: FigureDetailsComponent,
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'authentification', component: AuthComponent },
  { path: '', component: WelcomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}