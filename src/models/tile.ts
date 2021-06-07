import * as THREE from "three";

/**
 * A wrapper class for Three.JS' Mesh that allows us to have a 
 * 1x1x0 tile that we can toggle "on" or "off".
 */
export default class Tile extends THREE.Mesh{
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

    /*
        Haven't figured out how to change material on the fly,
        so we are just instantiating a new material each time.
    */
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
