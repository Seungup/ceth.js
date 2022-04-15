import GUI from "lil-gui";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import {
    API,
    setAddController,
    setRemoveAllController,
    setUpdateRandomPositionController,
    guiStatsEl,
} from "./api";

export function initGUI() {
    const CSS2DObjectArray = new Array<CSS2DObject>();

    const gui = new GUI({ autoPlace: false });

    const objectFolder = gui.addFolder("Object");
    objectFolder.add(API, "width", 1, 50000, 1);
    objectFolder.add(API, "hegith", 1, 50000, 1);
    objectFolder.add(API, "depth", 1, 50000, 1);

    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "2px";
    gui.domElement.style.left = "2px";

    document.body.appendChild(gui.domElement);

    gui.add(API, "maxRandomLat", 0, 100, 1);
    gui.add(API, "maxRandomLon", 0, 100, 1);

    gui.add(API, "count", 1000, 1_000_000, 1000);

    const renderFolder = gui.addFolder("Render");
    renderFolder
        .add(API, "skibbleFameCount", 0, 60, 1)
        .onFinishChange(async () => {
            await RendererContext.getRenderer(
                "MultipleOffscreenRenderer"
            ).setMaxiumSkibbleFrameCount(API.skibbleFameCount);
        });

    const actionFolder = gui.addFolder("Action");

    setAddController(actionFolder.add(API, "add"));
    setUpdateRandomPositionController(
        actionFolder.add(API, "updateRandomPosition")
    );
    setRemoveAllController(actionFolder.add(API, "removeAll"));

    const perfFolder = gui.addFolder("Performance");
    perfFolder.$children.appendChild(guiStatsEl);
    perfFolder.open();

    return {
        API,
        CSS2DObjectArray,
    };
}
