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

const CANVAS_COUNT = navigator.hardwareConcurrency;

{
    RendererContext.addRenderer(
        new MultipleOffscreenBuilder().setCanvasCount(CANVAS_COUNT).build()
    );

    const renderer = RendererContext.getRenderer("MultipleOffscreenRenderer");

    for (let i = 0; i < CANVAS_COUNT; i++) {
        renderer.addAt(new THREE.AmbientLight(), i);
    }
}

(async function animation() {
    RendererContext.render();
    viewer.render();
    requestAnimationFrame(animation);
})();

const { API, dataAccessorArray, RandomObject } = initGUI();

async function addObject(posiiton: { latitude: number; longitude: number }) {
    const count = API.count;

    const renderer = RendererContext.getRenderer("MultipleOffscreenRenderer");

    for (let i = 1; i <= count; i++) {
        if (i % 10 === 0) {
            API.latGap = Math.random();
            API.lonGap = Math.random();
            console.log(
                `${i.toLocaleString()} / ${count.toLocaleString()} ${Number(
                    ((i / count) * 100).toFixed(10)
                ).toLocaleString()}%`
            );
        }
        const object = RandomObject.choice();
        try {
            const dataAccessorParam = await renderer.dynamicAppend(
                object,
                randInt(0, CANVAS_COUNT - 1),
                {
                    position: {
                        wgs84: {
                            height: 0,
                            latitude: posiiton.latitude,
                            longitude: posiiton.longitude,
                        },
                    },
                    headingPitchRoll: {
                        heading: 0,
                        pitch: 0,
                        roll: 0,
                    },
                    visibility: true,
                }
            );

            dataAccessorArray.push(dataAccessorParam);

            posiiton.latitude += API.latGap;
            posiiton.longitude += API.lonGap;
        } catch (error) {
            console.error(error, object);
        }
    }
}

new ObjectEvent().onContextMenu.subscribe((event) => {
    const position = CesiumUtils.getLongitudeLatitudeByMouseEvent(event);
    addObject(position);
});
