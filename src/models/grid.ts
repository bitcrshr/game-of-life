import Tile from "./tile";

import * as THREE from "three";

export default class Grid extends THREE.GridHelper {
    private tileMatrix : Array<Array<Tile>>;
    private size : number;
    private readonly defaultTileSetting: boolean = false;

    constructor(size: number, camera: THREE.Camera, scene: THREE.Scene) {
        super(size, size);

        if (size % 2 == 0) {
            throw new Error(`Size of ${size} is not odd.`)
        }

        this.size = size;
        this.tileMatrix = new Array<Array<Tile>>(size);


        for (let i = 0; i < size; i++) {
            this.tileMatrix[i] = new Array<Tile>(size);
            for (let j = 0; j < size; j++) {
                this.tileMatrix[i][j] = new Tile(this.defaultTileSetting);
                this.tileMatrix[i][j].position.x = i;
                this.tileMatrix[i][j].position.y = j;
                scene.add(this.tileMatrix[i][j]);
            }
        }

        this.position.x += (size - 1) / 2;
        this.position.y += (size - 1) / 2;
        this.rotation.x = Math.PI / 2;
        camera.position.x += (size - 1) / 2;
        camera.position.y += (size - 1) / 2;
    }

    public set(x: number, y: number, value: boolean) : void {
        if (x > this.size || y > this.size) {
            throw new Error(`Tried to set (${x}, ${y}) but tileMatrix is ${this.size} x ${this.size}.`)
        }

        if (x < 0 || y < 0) {
            throw new Error(`(${x}, ${y}) is out of bounds.`);
        }

        this.tileMatrix[x][y].set(value);
    }

    public getRow(x: number) : Array<Tile> {
        if (x < 0 || x > this.size - 1) {
            throw new Error(`Row ${x} is out of bounds.`);
        }

        return this.tileMatrix[x];
    }

    public killAll() : void {
        this.tileMatrix.forEach((arr) => {
            arr.forEach((tile) => tile.kill());
        })
    }

    public reviveAll() : void {
        this.tileMatrix.forEach((arr) => {
            arr.forEach((tile) => tile.revive());
        })
    }

    public fillRandom() : void {
        this.killAll();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const alive = (Math.random()) >= 0.5;
                this.tileMatrix[i][j].set(alive);
            }
        }
    }

    public forEachTile(callback: (tile: Tile) => void) {
        this.tileMatrix.forEach((arr) => {
            arr.forEach(callback);
        });
    }

    public getNeighbors(row: number, col: number) : Array<Tile> {
        const neighbors = new Array<Tile>();

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) continue;
                if (this.isWithinBounds(row + x, col + y)) {
                    neighbors.push(this.tileMatrix[row + x][col + y]);
                }
            }
        }

        return neighbors;
    }

    private isWithinBounds(x: number, y: number) {
        if (x < 0 || x > this.size - 1) {
            return false;
        }

        if (y < 0 || y > this.size - 1) {
            return false;
        }

        return true;
    }
}