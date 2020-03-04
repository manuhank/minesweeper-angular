import { Component } from '@angular/core';
import { Game, Level } from './game.models';
import { BehaviorSubject } from 'rxjs';
import { GameService } from './game.service';
import { levels } from './constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'buscaminas';
  looseDialog = false;
  game: Game;
  levels
  constructor(private gameService: GameService) {
    this.levels = levels;
  }
  startGame(level: Level) {
    this.gameService.newGame(level).subscribe(game => {
      this.game = game;
    });
  }
  onTileClicked(tile) {
    if(this.game.status.value !== 1 || tile.revealed || tile.mark.value) return false
    this.gameService.tileRevealed(tile);
  }
  onTileRightClicked(tile) {
    if(this.game.status.value  !== 1) return false
    if(tile.revealed) this.gameService.tileRevealNeighbors(tile);
    else this.gameService.tileSwitchMark(tile);
    return false
  }


}
