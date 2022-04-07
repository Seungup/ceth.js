import { Viewer } from 'cesium';
import * as THREE from 'three';
import { Cesium3 } from '../../src/App/Cesium3';
import './css/main.css';
import { randInt } from 'three/src/math/MathUtils';
import { initGUI } from './initGUI';
import { MeshLambertMaterial } from 'three';
import { MultipleOffscreenRenderer } from '../../src/App/Components/Renderer';
import { IWGS84 } from '../../src/App/Math';
import { ObjectEvent } from '../../src/App/Objects/ObjectEvent';
import { CesiumUtils } from '../../src/App/Utils/CesiumUtils';
import { RendererContext } from '../../src/App/Context/RendererContext';

const constructorOptions: Viewer.ConstructorOptions = {
    useDefaultRenderLoop: false,
};

(function setViewerConstructorOptions(option: Viewer.ConstructorOptions) {
    option.infoBox = false;
    option.timeline = false;
    option.vrButton = false;
    option.geocoder = false;
    option.animation = false;
    option.sceneModePicker = false;
    option.baseLayerPicker = false;
    option.projectionPicker = false;
    option.fullscreenButton = false;
    option.navigationHelpButton = false;
})(constructorOptions);

const viewer = new Viewer('cesiumContainer', constructorOptions);

Cesium3.init(viewer);

const CANVAS_COUNT = navigator.hardwareConcurrency;
// const CANVAS_COUNT = 1;
{
    const renderer = Cesium3.Context.RendererContext.getInstance()
        .addRenderer(Cesium3.Renderers.MultipleOffscreenRenderer)
        .getRenderer('MultipleOffscreenRenderer')
        .makeCanvases(CANVAS_COUNT);

    for (let i = 0; i < CANVAS_COUNT; i++) {
        renderer.addAt(new THREE.AmbientLight(), i);
    }
}

(async function animation() {
    Cesium3.render();
    requestAnimationFrame(animation);
})();

const { API, object, objectArray } = initGUI();

(<MeshLambertMaterial>object.material).onBeforeCompile;

async function addObjectOnScene(
    renderer: MultipleOffscreenRenderer,
    object: THREE.Object3D,
    wgs84: IWGS84
) {
    try {
        objectArray.push(await renderer.addAt(object, randInt(0, CANVAS_COUNT - 1), wgs84));
    } catch (error) {
        console.error(error);
    }
}

new ObjectEvent().onContextMenu.subscribe((event) => {
    (async () => {
        const posiiton = CesiumUtils.getLongitudeLatitudeByMouseEvent(event);
        const count = API.count;
        const renderer = RendererContext.getInstance().getRenderer('MultipleOffscreenRenderer');
        for (let i = 0; i < count; i++) {
            await addObjectOnScene(renderer, object.clone(), {
                height: 0,
                latitude: posiiton.latitude,
                longitude: posiiton.longitude,
            });
            posiiton.latitude += API.latGap;
            posiiton.longitude += API.lonGap;
        }
    })();
});
