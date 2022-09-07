import { Injectable } from '@angular/core';
import { Game, Tile, Level, tileMarkPossiblesStates, gameStatusPossiblesStates } from './game.models';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { generateMinesPosition, getNeighborsOfTile, SimpleStateMachine } from './game.logic';
@Injectable({ providedIn: 'root' })
export class GameService {
    game: BehaviorSubject<Game>;
    private timer: Observable<number> = interval(1000);
    constructor() { }
    getGame(): BehaviorSubject<Game> {
        return this.game;
    }
    newGame(level: Level): BehaviorSubject<Game> {
        const { width, height, howManyMines } = level;
        let matrix = new Array(width).fill(null).map((_, x) =>
            new Array(height).fill(null).map((_, y) =>
                ({ revealed: false, value: 0, x, y, mark: new SimpleStateMachine(tileMarkPossiblesStates, "none") })
            )
        )

        this.game = new BehaviorSubject({
            height,
            width,
            howManyMines,
            matrix,
            seconds: 0,
            status: new SimpleStateMachine(gameStatusPossiblesStates, "inProgress")
        })
        return this.game;
    }
    setMines(tile: Tile) {
        let game = this.game.value;
        const { width, height, howManyMines, matrix } = game;
        const positionOfMines = generateMinesPosition(width, height, howManyMines, tile);
        positionOfMines.forEach(({ x, y }) => matrix[x][y].value = 'mine');
        const neighbors = getNeighborsOfTile(tile, game.matrix);
        tile.value = neighbors.filter(neighborTile => neighborTile.value === 'mine').length;
        game.timerSuscription = this.timer.subscribe(sec => game.seconds=sec);
    }
    tileRevealed(tile: Tile): void {
        tile.revealed = true;
        let game = this.game.value;
        const tilesLeft = game.matrix.flat().filter(neighborTile => !neighborTile.revealed).length
        if (tilesLeft + 1 === game.height * game.width) this.setMines(tile);
        if (tile.value === 'mine') {
            game.status.state = 'loose';
            game.timerSuscription.unsubscribe()
        } else if (tilesLeft === game.howManyMines) {
            game.status.state = 'win';
            game.timerSuscription.unsubscribe()
        } else {
            let neighbors = getNeighborsOfTile(tile, game.matrix);
            const minesAround = neighbors.filter(neighborTile => neighborTile.value === 'mine').length;
            if (minesAround) tile.value = minesAround;
            else neighbors.filter(neighborTile => !neighborTile.revealed && !neighborTile.mark.value).forEach(neighborTile => this.tileRevealed(neighborTile))

        }
    }
    tileSwitchMark(tile: Tile): void {
        tile.mark.value++;
    }
    tileRevealNeighbors(tile: Tile) {
        if (!tile.revealed) return
        let game = this.game.value;
        let neighbors = getNeighborsOfTile(tile, game.matrix);
        neighbors.filter(neighborTile => !neighborTile.revealed && !neighborTile.mark.value).forEach(neighborTile => this.tileRevealed(neighborTile));
    }

}