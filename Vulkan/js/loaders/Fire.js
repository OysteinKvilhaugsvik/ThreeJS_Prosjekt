import {Sprite, SpriteMaterial, TextureLoader, Vector3} from "../lib/three.module.js";

export default class Fire {

    constructor() {
        this.fireTexture = new TextureLoader().load('resources/textures/fire8x4.png');
        this.fireMaterial = new SpriteMaterial({
            map: this.fireTexture,
        });
        this.flameThrower = [];
    }

    naturalFire (scene, terrainGround) {
        for (let x = -50; x < 50; x += 4) {
            for (let z = -50; z < 50; z += 4) {

                const px = x + 1 + (6 * Math.random()) - 3;
                const pz = z + 1 + (6 * Math.random()) - 3;

                const height = terrainGround.geometry.getHeightAt(px, pz);

                if (height < 10 && height > 1) {
                    const fire = new Sprite(this.fireMaterial);
                    fire.position.x = px;
                    fire.position.y = height + 1;
                    fire.position.z = pz;
                    fire.scale.set(3, 3, 3);
                    scene.add(fire);
                }
            }
        }
    }

    //
    shootFire (scene, fromThis, toThis) {
        const fire = new Sprite(this.fireMaterial);
        fire.scale.set(1, 1, 1);
        fire.position.set(fromThis.position.x, fromThis.position.y, fromThis.position.z);
        fire.lookAt(toThis.position.x, toThis.position.y, toThis.position.z);
        this.flameThrower.push(fire);
        scene.add(fire);
    }

    updateFlamethrower (scene, delta) {
        for (let x = 0; x < this.flameThrower.length; x += 1) {
            const fire = this.flameThrower[x];
            const direction = new Vector3();
            fire.getWorldDirection(direction);
            fire.position.set(  fire.position.x + direction.x * (delta / 10),
                                fire.position.y + direction.y * (delta / 10),
                                fire.position.z + direction.z * (delta / 10));
            fire.scale.set(fire.scale.x + 0.2, fire.scale.y + 0.2, fire.scale.z + 0.2);
        }
        if (this.flameThrower.length > 0)
            if (this.flameThrower[0].position.x > 200 || this.flameThrower[0].position.x < -200 ||
                this.flameThrower[0].position.y > 100 || this.flameThrower[0].position.y < -50 ||
                this.flameThrower[0].position.z > 200 || this.flameThrower[0].position.z < -200)
                scene.remove(this.flameThrower.shift());
    }

    removeFlamethrower (scene) {
        while (this.flameThrower.length > 0)
            scene.remove(this.flameThrower.shift());
    }
}
