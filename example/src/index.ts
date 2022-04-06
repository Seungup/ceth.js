import { Viewer } from 'cesium';
import { Cesium3, ObjectAPI } from '../../src';
import { IWGS84, ObjectEvent } from '../../src/app';
import { GUI } from 'lil-gui';

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

const CANVAS_COUNT = navigator.hardwareConcurrency;

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

const object = new THREE.Mesh(
    new THREE.BoxGeometry(5000, 5000, 5000),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
);

let arr: ObjectAPI[] = [];

async function addObjectOnScene(object: THREE.Object3D, wgs84: IWGS84) {
    try {
        const obj = await Cesium3.Context.RendererContext.getInstance()
            .getRenderer('MultipleOffscreenRenderer')
            .addAt(object, randInt(0, CANVAS_COUNT - 1), wgs84);

        arr.push(obj);
    } catch (error) {
        console.error(error);
    }
}

const API = {
    count: 2500,
    latGap: 0.01,
    clear: () => {
        const size = arr.length;
        for (let i = 0; i < size; i++) {
            arr[i].remove();
        }
        arr = [];
    },
    lonGap: 0.01,
    help: () => {
        alert('원하는 위치에 마우스를 우클릭하여 테스트합니다.');
    },
};

const gui = new GUI({ autoPlace: false });
gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '2px';
gui.domElement.style.left = '2px';
document.body.appendChild(gui.domElement);
gui.add(API, 'count', 1, 5000, 1);
gui.add(API, 'latGap', 0.001, 0.05, 0.001);
gui.add(API, 'lonGap', 0.001, 0.05, 0.001);
gui.add(API, 'clear');
gui.add(API, 'help');

event.onContextMenu.subscribe((event) => {
    (async () => {
        const posiiton = Cesium3.CesiumUtils.getLongitudeLatitudeByMouseEvent(viewer, event);
        const count = API.count;
        for (let i = 0; i < count; i++) {
            posiiton.latitude += API.latGap;
            posiiton.longitude += API.lonGap;
            await addObjectOnScene(object.clone(), {
                height: 0,
                latitude: posiiton.latitude,
                longitude: posiiton.longitude,
            });
        }
    })();
});
