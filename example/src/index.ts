import { Viewer } from 'cesium';
import { Cesium3, CT_WGS84, WGS84_ACTION, Renderers } from '../../src';
import { ObjectEvent, ObjectPreview } from '../../src/app';

import './css/main.css';

import * as THREE from 'three';
import { Context } from '../../src/app/context';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { DOMRenderer } from '../../src/app/core/renderer/template/CSS2DRenderer';

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

const app = new Cesium3(viewer);
{
    const rendererContext = app.context.RendererContext;

    rendererContext.addRenderer(Renderers.OffscreenRenderer, Renderers.CSS2DRenderer);
}

const event = new ObjectEvent();
const preview = new ObjectPreview();

(function animation() {
    requestAnimationFrame(animation);
    app.context.RendererContext.doRender();
    viewer.render();
})();

// const object: TextLine = new TextLine('three.js', { font: Fonts.helvetiker_regular });
const object = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: true })
);

event.onContextMenu.subscribe(() => {
    if (!preview.isAttached()) {
        preview.attach(object, Renderers.OffscreenRenderer, async (api) => {
            const wgs84 = await api.getPosition();
            const box3 = await api.getBox3();
            if (box3) {
                wgs84.height = box3.z;
            }

            const position = {
                wgs84: wgs84,
                action: WGS84_ACTION.NONE,
            };

            const cloned = object.clone();

            const matrix = new CT_WGS84(position.wgs84, position.action).getMatrix4();

            cloned.applyMatrix4(matrix);
            Context.RendererContext.getRenderer(Renderers.OffscreenRenderer).add(cloned);
            (<DOMRenderer>Context.RendererContext.getRenderer(Renderers.CSS2DRenderer)).addText(
                'text',
                position
            );
            Cesium3.Utils.flyByObjectAPI(viewer, api);

            wgs84.height = 0;
        });
    }
});

event.onDblclick.subscribe(() => {
    if (preview.isAttached()) {
        preview.detach();
    }
});
