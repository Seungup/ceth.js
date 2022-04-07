import { Viewer } from 'cesium';
import * as THREE from 'three';
import { Cesium3 } from '../../src/App/Cesium3';
import './css/main.css';
import { randInt } from 'three/src/math/MathUtils';
import { initGUI } from './initGUI';
import { MeshLambertMaterial } from 'three';
import {
    DOMRenderer,
    MultipleOffscreenRenderer,
} from '../../src/App/Components/Renderer';
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

{
    const renderer = Cesium3.Context.RendererContext.getInstance()
        .addRenderer(
            Cesium3.Renderers.MultipleOffscreenRenderer,
            Cesium3.Renderers.DOMRenderer
        )
        .getRenderer('MultipleOffscreenRenderer')
        .makeCanvases(CANVAS_COUNT);

    for (let i = 0; i < CANVAS_COUNT; i++) {
        renderer.addAt(new THREE.AmbientLight(), i);
    }
}

(async function animation() {
    RendererContext.render();
    viewer.render();
    requestAnimationFrame(animation);
})();

const { API, object, apiArray } = initGUI();

(<MeshLambertMaterial>object.material).onBeforeCompile;

async function addObjectOnScene(
    object: THREE.Object3D,
    wgs84: IWGS84,
    multipleOffscreenRenderer?: MultipleOffscreenRenderer,
    domRenderer?: DOMRenderer
) {
    try {
        apiArray.push({
            ObjectAPI: await multipleOffscreenRenderer?.addAt(
                object,
                randInt(0, CANVAS_COUNT - 1),
                wgs84
            ),
            CSS2DObject: await domRenderer?.addText(
                `${Math.random().toFixed(10)}`,
                wgs84
            ),
        });
    } catch (error) {
        console.error(error);
    }
}

new ObjectEvent().onContextMenu.subscribe((event) => {
    (async () => {
        const posiiton = CesiumUtils.getLongitudeLatitudeByMouseEvent(event);
        const count = API.count;

        const context = RendererContext.getInstance();

        const multipleOffscreenRenderer = context.getRenderer(
            'MultipleOffscreenRenderer'
        );
        const domRenderer = context.getRenderer('DOMRenderer');

        for (let i = 0; i < count; i++) {
            await addObjectOnScene(
                object.clone(),
                {
                    height: 0,
                    latitude: posiiton.latitude,
                    longitude: posiiton.longitude,
                },
                multipleOffscreenRenderer,
                domRenderer
            );
            posiiton.latitude += API.latGap;
            posiiton.longitude += API.lonGap;
        }
    })();
});
