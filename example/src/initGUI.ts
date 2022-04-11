import GUI, { Controller } from "lil-gui";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import { DataAccessor } from "../../src/App/Data/Accessor/DataAccessor";

let removeAsyncAllController: Controller;

export function initGUI() {
    const DataAccessorArray = new Array<DataAccessor>();
    const CSS2DObjectArray = new Array<CSS2DObject>();

    const API = {
        count: 10_000,
        removeAsyncAll: async () => {
            removeAsyncAllController.disable();

            const domRenderer = RendererContext.getRenderer("DOMRenderer");

            console.time("await delete");
            while (DataAccessorArray.length) {
                await DataAccessorArray.pop().remove();
            }
            console.timeEnd("await delete");

            if (domRenderer) {
                console.time("delete dom");
                while (CSS2DObjectArray.length) {
                    const object = CSS2DObjectArray.pop();
                    domRenderer.remove(object.id);
                }
                console.timeEnd("delete dom");
            }
            removeAsyncAllController.enable();
        },
        lonGap: Math.random(),
        latGap: Math.random(),
        help: () => {
            alert("mouse right click somewhere in earth.");
        },
        width: 10000,
        height: 10000,
        depth: 10000,
    };

    const object = new THREE.Mesh(
        new THREE.BoxBufferGeometry(API.width, API.height, API.depth),
        new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0xffffff,
        })
    );

    const gui = new GUI({ autoPlace: false });
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "2px";
    gui.domElement.style.left = "2px";
    document.body.appendChild(gui.domElement);
    gui.add(API, "count", 1, 1_000_000, 1000);
    gui.add(API, "latGap", 0, 1, 0.001);
    gui.add(API, "lonGap", 0, 1, 0.001);
    gui.add(API, "width", 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new THREE.BoxBufferGeometry(
            API.width,
            API.height,
            API.depth
        );
    });
    gui.add(API, "height", 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new THREE.BoxBufferGeometry(
            API.width,
            API.height,
            API.depth
        );
    });
    gui.add(API, "depth", 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new THREE.BoxBufferGeometry(
            API.width,
            API.height,
            API.depth
        );
    });
    removeAsyncAllController = gui.add(API, "removeAsyncAll");
    gui.add(API, "help");

    return {
        object,
        API,
        DataAccessorArray,
        CSS2DObjectArray,
    };
}
