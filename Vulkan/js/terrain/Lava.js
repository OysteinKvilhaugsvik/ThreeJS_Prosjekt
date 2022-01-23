import * as THREE from "../lib/three.module.js";
import LavaShader from "../materials/LavaShader.js";
import {RepeatWrapping, TextureLoader, Vector3} from "../lib/three.module.js";
import TextureSplattingMaterial from "../materials/TextureSplattingMaterial.js";


    let lavaMaterial = new LavaShader({
            vertexShader: LavaShader.vertexShader,
            fragmentShader: LavaShader.fragmentShader,
            uniforms: {
                fogDensity: 0.002,
                fogColor: new THREE.Vector3(0, 0, 0),
                time: 1.0,
                uvScale: new THREE.Vector2(1, 1),
                texture1: new TextureLoader().load('./resources/textures/cloud.png'),
                texture2: new TextureLoader().load('./resources/textures/lava.jpg')
            }
        }
    )

    //Lava in volcano
    export function vulcanoLava() {
        let lavaGeometry = new THREE.PlaneGeometry(18, 14);

        const lavaVulcano = new THREE.Mesh(lavaGeometry, lavaMaterial);

        lavaVulcano.rotation.x = -Math.PI / 2;
        lavaVulcano.position.set(-3, 12, -4)

        return lavaVulcano;
    }

    // ----------------------------------------------------------------------------------------

    //Mye duplikat kode
    //koden under gjorde at uvScale til begge materialene ble oppdatert

    //let lavaFlowingMaterial = lavaMaterial
    //lava.material.uniforms.uvScale.value = new THREE.Vector2(5.0, 10.0);

    let lavaFlowingMaterial = new LavaShader({
            vertexShader: LavaShader.vertexShader,
            fragmentShader: LavaShader.fragmentShader,
            uniforms: {
                fogDensity: 0.002,
                fogColor: new THREE.Vector3(0, 0, 0),
                time: 1.0,
                uvScale: new THREE.Vector2(20, 20),
                texture1: new TextureLoader().load('./resources/textures/cloud.png'),
                texture2: new TextureLoader().load('./resources/textures/lava_dark.jpg')
            }
        }
    )

    //Flowing Lava
    export function flowingLava() {
        let lavaGeometry = new THREE.PlaneGeometry(2000, 2000);

        const lava = new THREE.Mesh(lavaGeometry, lavaFlowingMaterial);

        lava.rotation.x = -Math.PI / 2;
        lava.position.y = 0.5;

        return lava;
    }

