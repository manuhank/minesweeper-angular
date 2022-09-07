import { Component, Input, HostBinding } from '@angular/core';
import { Tile } from '../game.models';
import {colorOfTileValues} from '../constants'
@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  host: {
    '[class.revealed]': 'tile.revealed',
    '[class.mine]': "tile.revealed && tile.value === 'mine'",
    '[style.color]': "tile.revealed ? colorOfTileValues[tile.value]:colorOfTileValues[tile.mark.state]"
  }
})
export class TileComponent {
  @Input() tile: Tile
  colorOfTileValues
  constructor() {this.colorOfTileValues = colorOfTileValues }
  icon() {
    return this.tile.value > 0 ? this.tile.value : '' ;
  }
}
