import './style.css'

import * as THREE from "three";
import { BoxGeometry, GridHelper, MeshBasicMaterial } from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg') as HTMLCanvasElement
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 10;


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();

class Tile extends THREE.Mesh{
    alive: boolean;

    constructor(alive: boolean) {
        super(
            new THREE.BoxGeometry(1, 1, 0),
            new THREE.MeshBasicMaterial({
                color: alive ? 0xffffff : 0x00000,
            })
        );
        this.position.z = -0.001;
        this.alive = alive;
    }

    kill() : void {
        if (!this.alive) return;

        this.alive = false;
        this.material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
    }

    revive() : void {
        if (this.alive) return;

        this.alive = true;
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
    }

    set(alive: boolean) : void {
        if (alive) {
            this.revive();
            return;
        }

        this.kill();
    }
}

class Grid extends THREE.GridHelper {
    private tileMatrix : Array<Array<Tile>>;
    private size : number;

    constructor(size: number) {
        super(size, size);
        this.size = size;
        this.tileMatrix = new Array<Array<Tile>>(size);


        for (let i = 0; i < size; i++) {
            this.tileMatrix[i] = new Array<Tile>(size);
            for (let j = 0; j < size; j++) {
                this.tileMatrix[i][j] = new Tile(false);
                this.tileMatrix[i][j].position.x = i;
                this.tileMatrix[i][j].position.y = j;
                scene.add(this.tileMatrix[i][j]);
            }
        }

        this.position.x += (size - 1) / 2;
        this.position.y += (size - 1) / 2;
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
}

const grid : Grid = new Grid(9);
grid.rotation.x = Math.PI / 2;
grid.reviveAll();

scene.add(grid);

