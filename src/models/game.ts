import Grid from "./grid";
import Tile from "./tile";
import * as THREE from "three";

export default class GameOfLife {
    public grid: Grid;
    public camera: THREE.Camera;
    public scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public group: THREE.Group;

    constructor(size: number) {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene = new THREE.Scene();
        this.grid = new Grid(size, this.camera, this.scene);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg') as HTMLCanvasElement
        });
        this.group = new THREE.Group();
    }

    public init(initMatrix?: Array<Array<boolean>>) : void {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera.position.z = 10;

        this.grid.fillRandom();

        if (initMatrix) {
            initMatrix!.forEach((x, idx) => {
                x.forEach((y, idy) => {
                    this.grid.set(idx, idy, y);
                })
            });    
        }

        this.group.add(this.grid);
        this.grid.forEachTile((tile) => this.group.add(tile));
        this.scene.add(this.group);
    }

    public iterate() : void {
        this.grid.forEachTile((tile) => {
            const neighbors: Array<Tile> = this.grid.getNeighbors(
                tile.position.x,
                tile.position.y
            );

            let liveNeighbors = 0;

            neighbors.forEach((tile) => {
                if (tile.alive) {
                    liveNeighbors++;
                }
            });

            if (tile.alive) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    tile.kill();
                }
                return;
            }

            if (liveNeighbors == 3) {
                tile.revive();
            }
        })
    }
}