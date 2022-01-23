import * as THREE from './lib/three.module.js';
import {
    PCFSoftShadowMap,
    PerspectiveCamera,
    Vector3,
    WebGLRenderer,
} from './lib/three.module.js';

import MouseLookController from './controls/MouseLookController.js';
import {groundTerrain, ceilingTerrain} from "./terrain/Terrain.js";
import {flowingLava, vulcanoLava} from "./terrain/Lava.js"
import {Obelisk} from "./loaders/Obelisk.js";
import Fire from "./loaders/Fire.js";
import TextureAnimator from "./animator/TextureAnimator.js";
import {GLTFLoader} from "./loaders/GLTFLoader.js";

async function main() {

    const scene = new THREE.Scene();

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;
    camera.position.y = 30;
    camera.rotation.x -= 0.5;

    const renderer = new WebGLRenderer({ antialias: true});
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    /**
     * Handle window resize:
     *  - update aspect ratio.
     *  - update projection matrix
     *  - update renderer size
     */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    /**
     * Add canvas element to DOM.
     */
    document.body.appendChild(renderer.domElement);

    /**
     * Add light
     */
    // Ambient light
    const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambLight);

    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 2, 0, 2);
    pointLight.position.set(-3, 35, -3);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Helper for Point light
    //const pLHelper = new THREE.PointLightHelper(pointLight);
    //scene.add(pLHelper);

    /**
     * Add terrain
     */
    let terrainGround = await groundTerrain();
    terrainGround.receiveShadow = true;
    terrainGround.castShadow = true;
    let terrainCeiling = await ceilingTerrain();
    terrainCeiling.receiveShadow = true;
    terrainCeiling.castShadow = true;

    scene.add( terrainGround );
    terrainGround.add( terrainCeiling );


    /**
     * Add lava
     */
    let lavaFlowing = flowingLava();
    let lavaVulcano = vulcanoLava();

    terrainGround.add( lavaFlowing );
    terrainGround.add( lavaVulcano );

    /**
     * Add fire
     */
    const fireGenerator = new Fire();
    fireGenerator.naturalFire(terrainGround, terrainGround);

    /**
     * Add Obelisks
     */
    Obelisk(terrainGround, terrainGround);

    /**
     * Add skybox
     */
    const skyLoader = new THREE.CubeTextureLoader();
    const skyRef = 'resources/textures/netherack_dark.png';
    scene.background = skyLoader.load([
        skyRef, skyRef, skyRef, skyRef, skyRef, skyRef
    ]);

    /**
     * Add ghast
     */
    let loader = new GLTFLoader();
    let ghast;
    // Load a glTF resource
    loader.load(
        // resource URL
        'resources/models/ghast/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            ghast = gltf.scene;
            terrainGround.add(ghast);
        }
    );

    /**
     * Set up camera controller:
     */

    const mouseLookController = new MouseLookController(camera);

    // We attach a click lister to the canvas-element so that we can request a pointer lock.
    // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
    const canvas = renderer.domElement;

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

    let yaw = 0;
    let pitch = 0;
    const mouseSensitivity = 0.001;

    function updateCamRotation(event) {
        yaw += event.movementX * mouseSensitivity;
        pitch += event.movementY * mouseSensitivity;
    }

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas) {
            canvas.addEventListener('mousemove', updateCamRotation, false);
        } else {
            canvas.removeEventListener('mousemove', updateCamRotation, false);
        }
    });

    let move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        speed: 0.01
    };

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') {
            move.forward = true;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = true;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = true;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = true;
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW') {
            move.forward = false;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = false;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = false;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = false;
            e.preventDefault();
        }
    });

    const velocity = new Vector3(0.0, 0.0, 0.0);

    // Animator for fire
    const fireAnimator = new TextureAnimator(fireGenerator.fireTexture, 8, 4, 32, 50);

    // Flamethrower
    const flamethrowerInterval = 50;
    let flamethrowerCounter = 0;

    // Continual movement
    let mov = 0;

    let then = performance.now();
    function loop(now) {

        const delta = now - then;
        then = now;

        const moveSpeed = move.speed * delta;

        velocity.set(0.0, 0.0, 0.0);

        if (move.left) {
            velocity.x -= moveSpeed;
        }

        if (move.right) {
            velocity.x += moveSpeed;
        }

        if (move.forward) {
            velocity.z -= moveSpeed;
        }

        if (move.backward) {
            velocity.z += moveSpeed;
        }

        // Ghast movement
        if(ghast != undefined){
            mov += (delta/1000) / 2;
            ghast.position.set( 100 * Math.sin(mov), 35 + (10 * Math.sin(mov * 5)), 33 * Math.sin(mov * 2));
            ghast.lookAt(camera.position.x, camera.position.y, camera.position.z);
            ghast.rotateY(Math.sin(mov * 10) / 3);

            //Sjekker om kamera er nærme nok til ghasten.
            if (Math.sqrt(Math.pow(ghast.position.x - camera.position.x, 2) + Math.pow(ghast.position.z - camera.position.z, 2) < 3000))
                ghast.scale.set(Math.sin(mov*100) / 10 + 0.9, Math.sin(mov*100) / 10 + 0.9, Math.sin(mov*100) / 10 + 0.9);
            else
                ghast.scale.set(0.9, 0.9, 0.9);
        }

        // Shoot and update flamethrower

        fireGenerator.updateFlamethrower(terrainGround, delta);
        flamethrowerCounter += delta;
        if (flamethrowerCounter > flamethrowerInterval) {
            flamethrowerCounter -= flamethrowerInterval;
            if (ghast != undefined)
                if (Math.sqrt(Math.pow(ghast.position.x - camera.position.x, 2) + Math.pow(ghast.position.z - camera.position.z, 2) < 3000))
                    fireGenerator.shootFire(terrainGround, ghast, camera);
        }

        // Update controller rotation:
        mouseLookController.update(pitch, yaw);
        yaw = 0;
        pitch = 0;

        // Apply rotation to velocity vector, and translate moveNode with it:
        velocity.applyQuaternion(camera.quaternion);
        camera.position.add(velocity);

        // Lava animation:
        lavaFlowing.material.uniforms['time'].value += 0.006
        lavaVulcano.material.uniforms['time'].value += 0.03

        // Fire animation:
        fireAnimator.update(delta);

        // Render scene:
        renderer.render(scene, camera);

        requestAnimationFrame(loop);

    }

    loop(performance.now());

}

main(); // Start application