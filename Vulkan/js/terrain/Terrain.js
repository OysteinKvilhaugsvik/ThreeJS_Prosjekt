import Utilities from "../lib/Utilities.js";
import TerrainBufferGeometry from "./TerrainBufferGeometry.js";
import {BackSide, Mesh, RepeatWrapping, TextureLoader} from "../lib/three.module.js";
import TextureSplattingMaterial from "../materials/TextureSplattingMaterial.js";

    let width = 100;
    const netherackTexture = new TextureLoader().load('./resources/textures/netherack.png');
    netherackTexture.wrapS = RepeatWrapping;
    netherackTexture.wrapT = RepeatWrapping;
    netherackTexture.repeat.set(5000 / width, 5000 / width);

    const magmaRockTexture = new TextureLoader().load('./resources/textures/magmarock.png');
    magmaRockTexture.wrapS = RepeatWrapping;
    magmaRockTexture.wrapT = RepeatWrapping;
    magmaRockTexture.repeat.set(1500 / width, 1500 / width);

    const splatMap = new TextureLoader().load('./resources/images/splatmap_01.png');
    const splatMap2 = new TextureLoader().load('./resources/images/splatmap_02.png');


    //Ground terrain
    export async function groundTerrain() {
        let heightmapImage = await Utilities.loadImage('./resources/images/heightmapvol.png');
        width = 100;

        const terrainGeometry = new TerrainBufferGeometry({
            width,
            heightmapImage,
            numberOfSubdivisions: 128,
            height: 20
        });

        const terrainMaterial = new TextureSplattingMaterial({
            color: 0xffffff,
            shininess: 0,
            textures: [magmaRockTexture, netherackTexture],
            splatMaps: [splatMap]
        });

        return new Mesh(terrainGeometry, terrainMaterial);
    }

    // ----------------------------------------------------------------------------------------

    //Ceiling terrain
    export async function ceilingTerrain() {
       let heightmapImage = await Utilities.loadImage('./resources/images/heightmap_ceiling.png');
       width = 300;

        const terrainGeometryCeiling = new TerrainBufferGeometry({
            width,
            heightmapImage,
            numberOfSubdivisions: 300,
            height: 30
        });

        const terrainMaterialCeiling = new TextureSplattingMaterial({
            color: 0xffffff,
            shininess: 0,
            textures: [magmaRockTexture, netherackTexture],
            splatMaps: [splatMap2]
        });

        terrainMaterialCeiling.side = BackSide;
        const terrainCeiling = new Mesh(terrainGeometryCeiling, terrainMaterialCeiling);

        terrainCeiling.castShadow = false;
        terrainCeiling.receiveShadow = false;

        terrainCeiling.position.y = 40;
        return terrainCeiling;
    }



