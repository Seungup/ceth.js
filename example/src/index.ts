import { Viewer } from 'cesium';
import { SphereGeometry, DoubleSide, PointsMaterial } from 'three';
import { Cesium3, CT_WGS84, MetaPoints, WGS84_ACTION, OffscreenRenderer } from '../../src';
import { ObjectEvent, ObjectPreview } from '../../src/app';
import { DOMRenderer } from '../../src/app/core/renderer/template/dom.renderer';

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

const app = new Cesium3(viewer);
{
    const rendererContext = app.context.RendererContext;

    rendererContext.addRenderer(OffscreenRenderer);
    rendererContext.addRenderer(DOMRenderer);
}

const event = new ObjectEvent();
const preview = new ObjectPreview();

(function animation() {
    requestAnimationFrame(animation);
    app.context.RendererContext.doRender();
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

            const renderer = app.context.RendererContext.getRenderer(DOMRenderer);
            if (renderer) {
                (<DOMRenderer>renderer).add(
                    new CT_WGS84(position.wgs84, position.action).toString(),
                    position
                );
            }

            wgs84.height = 0;

            app.manger.add(object, position).then((api) => {
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
