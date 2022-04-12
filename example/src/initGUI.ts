import GUI from "lil-gui";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { API, setRemoveAllController, dataAccessorArray } from "./api";
import { RandomObject } from "./randomObject";

export function initGUI() {
    const CSS2DObjectArray = new Array<CSS2DObject>();

    const gui = new GUI({ autoPlace: false });

    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "2px";
    gui.domElement.style.left = "2px";

    document.body.appendChild(gui.domElement);

    gui.add(API, "count", 1000, 1_000_000, 1000);

    setRemoveAllController(gui.add(API, "removeAll"));

    gui.add(API, "help");

    return {
        API,
        dataAccessorArray,
        CSS2DObjectArray,
        RandomObject: new RandomObject(),
    };
}
