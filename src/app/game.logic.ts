import { Tile } from './game.models';

export class SimpleStateMachine {
    posiblesStates: any[];
    private _howManyStates: number;
    private _state: string;
    private _value: number;
    get state(): string {
        return this._state
    }
    set state(newState: string) {
        const index = this.posiblesStates.indexOf(newState);
        if (index == -1) throw new Error("");
        this._value = index;
        this._state = newState;
    }
    get value(): number {
        return this._value
    }
    set value(newValue: number) {
        newValue = newValue < this._howManyStates ? newValue : 0;
        this._value = newValue;
        this._state = this.posiblesStates[newValue];
    }
    constructor(posiblesStates: any[], initialState: number | string) {
        this.posiblesStates = posiblesStates;
        this._howManyStates = posiblesStates.length;
        if (typeof initialState === 'string') {
            this._state = initialState;
            this._value = this.posiblesStates.indexOf(initialState);
        } else {
            this._state = this.posiblesStates[initialState];
            this._value = initialState;
        }
        //TODO: esto deberia generar metodos por cada estado, pero no se validan en TS
        // posiblesStates.forEach(state => Object.defineProperty(this, state, () => this.state === state ))
    }

}

export function generateMinesPosition(width: number, height: number, howManyMines: number, initialTile: Tile) {
    let positionOfMines = [];

    const mineAt = (arrayOfPositions, x, y) =>
        arrayOfPositions.find(position => position.x == x && position.y == y);

    for (let i = 0; i < howManyMines; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (mineAt(positionOfMines, x, y) ||
            (x == initialTile.x && y == initialTile.y)) { i--; continue }
        else positionOfMines.push({ x, y });
    }
    return positionOfMines;
}

export function getNeighborsOfTile(tile: Tile, matrix: Tile[][]) {
    const { x, y } = tile;
    const width = matrix.length;
    const height = matrix[0].length;
    const neighbors = [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y },
        { x: x - 1, y: y + 1 },
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 }
    ].filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height)
        .map(({ x, y }) => matrix[x][y]);
    return neighbors;
}