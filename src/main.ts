import './style.css'

import GameOfLife from "./models/game";
import Grid from './models/grid';
import * as THREE from "three";

const game: GameOfLife = new GameOfLife(13);

game.init();

document.getElementById("bg")!.onclick = onClick;

function onClick() {
    game.iterate();
    console.log("iterated");
}

function animate() {
    requestAnimationFrame(animate);
    
    game.renderer.render(game.scene, game.camera);
}

setInterval(() => game.iterate(), 500);

animate();