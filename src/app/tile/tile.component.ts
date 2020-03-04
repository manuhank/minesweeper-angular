import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tile } from '../game.models';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  host: {
    '[class.revealed]': 'tile.revealed',
    '[class.mine]': "tile.revealed && tile.value === 'mine'"
  }
})
export class TileComponent {
  @Input() tile: Tile
  constructor() { }
  icon() {
    return this.tile.value > 0 ? this.tile.value : '' ;
  }
}
