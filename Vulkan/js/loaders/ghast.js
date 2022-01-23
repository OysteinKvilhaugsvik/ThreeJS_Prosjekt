import {GLTFLoader} from "./GLTFLoader.js";
import * as THREE from "../lib/three.module.js";

export function addGhast(scene, terrainGround) {
    let loader = new GLTFLoader();
    let ghast = new THREE.Object3D();


    terrainGround.add(ghast)
    // Load a glTF resource
    loader.load(
        // resource URL
        'resources/models/ghast/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            let ghastL = gltf.scene;
            ghast.add(ghastL);
        }
    );
    console.log(ghast)

}