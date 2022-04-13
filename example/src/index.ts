import { Viewer } from "cesium";
import * as THREE from "three";
import { Cesium3 } from "../../src/App/Cesium3";
import "./css/main.css";
import { initGUI } from "./initGUI";
import { ObjectEvent } from "../../src/App/Objects/ObjectEvent";
import { CesiumUtils } from "../../src/App/Utils/CesiumUtils";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import { MultipleOffscreenBuilder } from "../../src/App/Components/Renderer";
import { randInt } from "three/src/math/MathUtils";

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

RendererContext.addRenderer(
    new MultipleOffscreenBuilder()
        .setCanvasCount(navigator.hardwareConcurrency)
        .build()
);

(async function animation() {
    RendererContext.render();
    viewer.render();
    requestAnimationFrame(animation);
})();
