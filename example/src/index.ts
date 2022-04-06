import { Viewer } from 'cesium';
import { Cesium3, CT_WGS84 } from '../../src';
import { ObjectEvent, ObjectPreview } from '../../src/app';

import './css/main.css';

import * as THREE from 'three';

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

{
    const context = Cesium3.Context.RendererContext.getInstance();
    context.addRenderer(
        Cesium3.Renderers.OffscreenRendererProxy /**, Cesium3.Renderers.DOMRenderer*/
    );
}

const event = new ObjectEvent();
const preview = new ObjectPreview();

(function animation() {
    requestAnimationFrame(animation);
    Cesium3.render();
})();

const object = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: true })
);

event.onContextMenu.subscribe(() => {
    if (!preview.isAttached()) {
        preview.attach(object, 'OffscreenRenderer', async (api) => {
            const wgs84 = await api.getPosition();
            const box3 = await api.getBox3();
            if (box3) {
                wgs84.height = box3.z;
            }

            const cloned = object.clone();

            const matrix = new CT_WGS84(wgs84).getMatrix4();

            cloned.applyMatrix4(matrix);
            const context = Cesium3.Context.RendererContext.getInstance();
            try {
                context.getRenderer('OffscreenRenderer').add(cloned);
                context.getRenderer('DOMRenderer').addText('text', wgs84);
            } catch (error) {
                console.error(error);
            }
            Cesium3.CesiumUtils.flyByObjectAPI(viewer, api);

            wgs84.height = 0;
        });
    }
});

event.onDblclick.subscribe(() => {
    if (preview.isAttached()) {
        preview.detach();
    }
});
