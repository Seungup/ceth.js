import { Viewer } from "cesium";
import * as THREE from "three";
import { Cesium3 } from "../../src/App/Cesium3";
import "./css/main.css";
import { randInt } from "three/src/math/MathUtils";
import { initGUI } from "./initGUI";
import { ObjectEvent } from "../../src/App/Objects/ObjectEvent";
import { CesiumUtils } from "../../src/App/Utils/CesiumUtils";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import {
    MultipleOffscreenBuilder,
    MultipleOffscreenRenderer,
} from "../../src/App/Components/Renderer";
import { WGS84_ACTION } from "../../src/App/Math";
import { DataAccessor } from "../../src/App/Data/Accessor/DataAccessor";
import Appearance from "cesium/Source/Scene/Appearance";
import { ApplicationContext } from "../../src/App/Contexts/ApplicationContext";

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

const CANVAS_COUNT = navigator.hardwareConcurrency - 1; // without main thread

{
    const builder = new MultipleOffscreenBuilder();

    const renderer = builder.setCanvasCount(CANVAS_COUNT).build();

    RendererContext.addRenderer(renderer);

    for (let i = 0; i < CANVAS_COUNT; i++) {
        renderer.addAt(new THREE.AmbientLight(), i);
    }
}

(async function animation() {
    RendererContext.render();
    viewer.render();
    requestAnimationFrame(animation);
})();

const { API, object, DataAccessorArray } = initGUI();

async function addObject(posiiton: { latitude: number; longitude: number }) {
    const count = API.count;
    let dataAccessor: DataAccessor;
    for (let i = 0; i < count; i++) {
        dataAccessor = await RendererContext.getRenderer(
            "MultipleOffscreenRenderer"
        ).dynamicAppend(
            object.clone(),
            randInt(0, CANVAS_COUNT - 1),
            {
                height: 0,
                latitude: posiiton.latitude,
                longitude: posiiton.longitude,
            },
            WGS84_ACTION.NONE,
            true
        );

        DataAccessorArray.push(dataAccessor);

        posiiton.latitude += API.latGap;
        posiiton.longitude += API.lonGap;
    }
}

new ObjectEvent().onContextMenu.subscribe(async (event) => {
    console.time("ADD");
    await addObject(CesiumUtils.getLongitudeLatitudeByMouseEvent(event));
    console.timeEnd("ADD");
});
