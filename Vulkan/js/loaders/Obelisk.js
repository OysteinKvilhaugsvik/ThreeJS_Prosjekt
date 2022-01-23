import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "./GLTFLoader.js";


    const normalMap = new THREE.TextureLoader().load( "resources/models/obelisk/textures/normalMap.png");
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.flipY = false;
    normalMap.repeat.set(0.1,0.1);

    const specularMap = new THREE.TextureLoader().load( "resources/models/obelisk/textures/specularMap.png");
    specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
    specularMap.flipY = false;
    specularMap.repeat.set(0.1,0.1);

    const textureObelisk = new THREE.TextureLoader().load( "resources/models/obelisk/textures/texture.jpg");
    textureObelisk.wrapS = textureObelisk.wrapT = THREE.RepeatWrapping;
    textureObelisk.flipY = false;
    textureObelisk.repeat.set(0.1,0.1);

    const normalMaterial = new THREE.MeshPhongMaterial( {
        color: 0x494949,
        map: textureObelisk,
        specular: 0x222222,
        specularMap: specularMap,
        shininess: 15,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(2,2)
    } );

    // ----------------------------------------------------------------------------------------

    export function Obelisk(scene, terrainGround) {
        let loader = new GLTFLoader();

        loader.load(
            // resource URL
            'resources/models/obelisk/scene.glb',
            // called when resource is loaded
            (object) => {
                for (let x = -50; x < 50; x += 8) {
                    for (let z = -50; z < 50; z += 8) {

                        const px = x + 1 + (6 * Math.random()) - 3;
                        const pz = z + 1 + (6 * Math.random()) - 3;

                        const height = terrainGround.geometry.getHeightAt(px, pz);

                        if (height < 4 && height > 1) {
                            let obelisk = object.scene.children[0].clone();
                            obelisk.scale.set(2, 2, 2);

                            obelisk.traverse((child) => {
                                if (child.isMesh) {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                    child.material = normalMaterial;
                                }
                            });

                            obelisk.position.x = px;
                            obelisk.position.y = height - 0.01;
                            obelisk.position.z = pz;

                            obelisk.rotation.y = Math.random() * (2 * Math.PI);

                            obelisk.scale.multiplyScalar(1.5 + Math.random());
                            scene.add(obelisk);
                        }

                    }
                }
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );
    }