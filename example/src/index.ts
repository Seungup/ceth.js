import { Viewer } from 'cesium';
import { Cesium3, MetaMesh, ObjectAPI } from '../../src';
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

const event = new ObjectEvent();

(async function animation() {
    requestAnimationFrame(animation);
    Cesium3.render();
})();

let arr: ObjectAPI[] = [];

const API = {
    count: 2500,
    latGap: 0.05,
    clear: () => {
        while (arr.length) {
            arr.pop().remove();
        }
    },
    lonGap: 0.05,
    help: () => {
        alert('원하는 위치에 마우스를 우클릭하여 테스트합니다.');
    },
    width: 500,
    height: 500,
    depth: 500,
};

const gui = new GUI({ autoPlace: false });
gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '2px';
gui.domElement.style.left = '2px';
document.body.appendChild(gui.domElement);
gui.add(API, 'count', 1, 50000, 1);
gui.add(API, 'latGap', 0.0001, 0.01, 0.0001);
gui.add(API, 'lonGap', 0.0001, 0.01, 0.0001);
gui.add(API, 'clear');
gui.add(API, 'help');
gui.add(API, 'width', 1, 1000).onFinishChange(() => {
    object.geometry.dispose();
    object.geometry = new THREE.BoxGeometry(API.width, API.height, API.depth);
});
gui.add(API, 'height', 1, 1000).onFinishChange(() => {
    object.geometry.dispose();
    object.geometry = new THREE.BoxGeometry(API.width, API.height, API.depth);
});
gui.add(API, 'depth', 1, 1000).onFinishChange(() => {
    object.geometry.dispose();
    object.geometry = new THREE.BoxGeometry(API.width, API.height, API.depth);
});

let object = new MetaMesh(
    new THREE.BoxGeometry(API.width, API.height, API.depth),
    new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })
);

async function addObjectOnScene(object: THREE.Object3D, wgs84: IWGS84) {
    try {
        arr.push(
            await Cesium3.Context.RendererContext.getInstance()
                .getRenderer('MultipleOffscreenRenderer')
                .addAt(object, randInt(0, CANVAS_COUNT - 1), wgs84)
        );
    } catch (error) {
        console.error(error);
    }
}

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
        alert('DONE.');
    })();
});
