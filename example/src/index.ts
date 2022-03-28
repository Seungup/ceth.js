import { Viewer } from 'cesium';
import { BoxBufferGeometry, DoubleSide, MeshNormalMaterial } from 'three';
import { Cesium3, CT_WGS84, MetaMesh, WGS84_TYPE } from '../../src';

import './css/main.css';

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

const factory = new Cesium3.InterfcaeFactory(viewer);

const preview = factory.preview;
const event = factory.event;
const WebGLRenderer = factory.WebGLRenderer;
const CSS2DRenderer = factory.CSS2DRenderer;

(function animation() {
    requestAnimationFrame(animation);
    WebGLRenderer.render();
    CSS2DRenderer.render();
    viewer.render();
})();

const object = new MetaMesh(
    new BoxBufferGeometry(100, 100, 100),
    new MeshNormalMaterial({
        side: DoubleSide,
    })
);
event.onContextMenu.subscribe(() => {
    if (!preview.isAttached()) {
        preview.attach(object, (position) => {
            const wgs84 = new CT_WGS84(position, WGS84_TYPE.CESIUM);
            wgs84.height = 100;
            CSS2DRenderer.add(`${wgs84.toString()}`, wgs84, WGS84_TYPE.THREEJS);
            wgs84.height = 0;
            factory.manager.add(object, wgs84.toIWGS84());
        });
    }
});

event.onDblclick.subscribe(() => {
    if (preview.isAttached()) {
        preview.detach();
    }
});
