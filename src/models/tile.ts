import * as THREE from "three";

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
