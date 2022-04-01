import { Viewer } from 'cesium';
import { SphereGeometry, DoubleSide, PointsMaterial } from 'three';
import { Cesium3, CT_WGS84, MetaPoints, WGS84_ACTION } from '../../src';
import { Object3DCSS2DRenderer } from '../../src/app/factory/renderers/Object3DCSS2DRenderer';

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
    factory.renderers.render();
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
        preview.attach(object, async (api) => {
            const wgs84 = await api.getPosition();
            const box3 = await api.getBox3();

            wgs84.height = box3.z;

            const position = {
                wgs84: wgs84,
                action: WGS84_ACTION.NONE,
            };

            const renderer = factory.renderers.getRenderer('CSS2DRenderer');

            renderer.add(new CT_WGS84(position.wgs84, position.action).toString(), position);

            wgs84.height = 0;

            factory.manager.add(object, position).then((api) => {
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
