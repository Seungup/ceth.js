import { Viewer } from 'cesium';
import { SphereGeometry, AxesHelper, DoubleSide, Material, PointsMaterial } from 'three';
import { Cesium3, CT_WGS84, MetaMesh, MetaPoints, WGS84_TYPE } from '../../src';

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

(function animation() {
    requestAnimationFrame(animation);
    factory.renderers.updateAll();
    factory.renderers.renderAll();
    viewer.render();
})();

const object = new MetaPoints(
    new SphereGeometry(70, 120, 80),
    new PointsMaterial({
        color: 'red',
        side: DoubleSide,
        sizeAttenuation: false,
        size: 3,
    })
);

event.onContextMenu.subscribe(() => {
    if (!preview.isAttached()) {
        preview.attach(object, (position) => {
            const wgs84 = new CT_WGS84(position, WGS84_TYPE.CESIUM);
            wgs84.height = 100000;
            factory.renderers.CSS2DRenderer.add(`${wgs84.toString()}`, wgs84, WGS84_TYPE.THREEJS);
            wgs84.height = 0;

            const axes = new AxesHelper(10000);
            if (axes.material instanceof Material) {
                axes.material.depthTest = false;
            }
            axes.renderOrder = 1;
            object.add(axes);

            factory.manager.add(object, wgs84.toIWGS84()).then((api) => {
                Cesium3.Utils.flyByObjectAPI(viewer, api);
            });
        });
    }
});

event.onDblclick.subscribe(() => {
    if (preview.isAttached()) {
        preview.detach();
    }
});
