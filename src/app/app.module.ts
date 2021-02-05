import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './views/auth/auth.component';
import { BoardComponent } from './views/board/board.component';
import { BasicBoardComponent } from './views/board/components/basic-board/basic-board.component';
import { PromotionSelectionComponent } from './views/board/components/basic-board/promotion-selection/promotion-selection.component';
import { InfoComponent } from './views/board/components/info/info.component';
import { FiguresComponent } from './views/figures/figures.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { AccountComponent } from './views/account/account.component';
import { FigureComponent } from './views/figures/figure/figure.component';
import { FigureDetailsComponent } from './views/figures/figure-details/figure-details.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { MessageFormComponent } from './views/messages/components/message-form/message-form.component';
import { MessageDisplayComponent } from './views/messages/components/message-display/message-display.component';
import { MessageOptionsComponent } from './views/messages/components/message-options/message-options.component';
import { ConnectionTimePipe } from './pipes/connection-time.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { UsersComponent } from './views/users/users.component';
import { UserService } from './services/user.service';
import { MessagesService } from './views/messages/services/messages.service';
import { NavigationComponent } from './views/navigation/navigation.component';
import { CreateUserComponent } from './views/create-user/create-user.component';

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
    MessageFormComponent,
    MessageDisplayComponent,
    MessageOptionsComponent,
    ConnectionTimePipe,
    SortPipe,
    UsersComponent,
    NavigationComponent,
    CreateUserComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [UserService, MessagesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
