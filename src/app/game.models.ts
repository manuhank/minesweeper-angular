import { SimpleStateMachine } from './game.logic';
import { Observable } from 'rxjs';

export interface Level {
    height: number,
    width: number,
    howManyMines:number
}
export const tileMarkPossiblesStates = ["none","flagged","dubious"];
export const gameStatusPossiblesStates = ["noGame", "inProgress", "win", "loose"];
export interface Tile {
    revealed: boolean,
    mark: SimpleStateMachine,
    value: number|string,
    x:number,
    y:number
}
export interface Game {
    height: number,
    width: number,
    howManyMines: number,
    matrix: Tile[][],
    timerSuscription?,
    seconds: number,
    status:SimpleStateMachine
}
