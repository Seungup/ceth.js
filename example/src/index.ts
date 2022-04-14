import { Viewer } from "cesium";
import "./css/main.css";

import { Cesium3 } from "../../src/App/Cesium3";
import { initGUI } from "./initGUI";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import { MultipleOffscreenRenderer } from "../../src/App/Components/Renderer";

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

const viewer = new Viewer("cesiumContainer", constructorOptions);

Cesium3.init(viewer);

initGUI();

RendererContext.addRenderer(MultipleOffscreenRenderer);

(async function animation() {
    RendererContext.render();
    viewer.render();
    requestAnimationFrame(animation);
})();
