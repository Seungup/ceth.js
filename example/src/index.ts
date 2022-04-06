import { Viewer } from 'cesium';
import { Cesium3, CT_WGS84 } from '../../src';
import { IWGS84, ObjectEvent } from '../../src/app';

import './css/main.css';

import * as THREE from 'three';
import { randInt } from 'three/src/math/MathUtils';

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

// const CANVAS_COUNT = navigator.hardwareConcurrency;
const CANVAS_COUNT = 11;
{
    Cesium3.Context.RendererContext.getInstance()
        .addRenderer(Cesium3.Renderers.MultipleOffscreenRenderer)
        .getRenderer('MultipleOffscreenRenderer')
        .makeCanvases(CANVAS_COUNT);
}

const event = new ObjectEvent();

(async function animation() {
    requestAnimationFrame(animation);
    Cesium3.render();
})();

const object = new THREE.Points(
    new THREE.BoxGeometry(10000, 10000, 10000),
    new THREE.PointsMaterial({ side: THREE.DoubleSide, size: 10 })
);

async function addObjectOnScene(object: THREE.Object3D, wgs84: IWGS84) {
    try {
        await Cesium3.Context.RendererContext.getInstance()
            .getRenderer('MultipleOffscreenRenderer')
            .addAt(object, randInt(0, CANVAS_COUNT - 1), wgs84);
    } catch (error) {
        console.error(error);
    }
}

event.onContextMenu.subscribe((event) => {
    (async () => {
        const posiiton = Cesium3.CesiumUtils.getLongitudeLatitudeByMouseEvent(viewer, event);
        const count = 5000;
        for (let i = 0; i < count; i++) {
            posiiton.latitude += 0.1;
            posiiton.longitude += 0.1;
            await addObjectOnScene(object.clone(), {
                height: 0,
                latitude: posiiton.latitude,
                longitude: posiiton.longitude,
            });
        }
    })();
});
