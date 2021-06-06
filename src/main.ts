import './style.css'

import * as THREE from "three";

import Grid from "./models/grid";
import Tile from "./models/tile";

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




const grid : Grid = new Grid(7, camera, scene);

grid.killAll();


const n = grid.getNeighbors(3, 3);
n.forEach((tile) => tile.revive());
scene.add(grid);



