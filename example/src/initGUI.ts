import GUI, { Controller } from 'lil-gui';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RendererContext } from '../../src/App/Contexts/RendererContext';
import { ObjectAPI } from '../../src/App/Objects/ObjectAPI';

let removeAllController: Controller;
let removeAsyncAllController: Controller;

export function initGUI() {
    const objectAPIArray = new Array<ObjectAPI>();
    const CSS2DObjectArray = new Array<CSS2DObject>();

    const API = {
        skipFrameSize: 0,
        count: 10000,
        removeAll: () => {
            removeAllController.disable();
            removeAsyncAllController.disable();
            const domRenderer = RendererContext.getRenderer('DOMRenderer');

            console.time('delete api');
            while (objectAPIArray.length) {
                objectAPIArray.pop().remove();
            }
            console.timeEnd('delete api');

            if (domRenderer) {
                console.time('delete dom');
                while (CSS2DObjectArray.length) {
                    const object = CSS2DObjectArray.pop();
                    domRenderer.remove(object.id);
                }
                console.timeEnd('delete dom');
            }

            removeAsyncAllController.enable();
            removeAllController.enable();
        },
        removeAsyncAll: async () => {
            removeAllController.disable();
            removeAsyncAllController.disable();

            const domRenderer = RendererContext.getRenderer('DOMRenderer');

            console.time('await delete');
            while (objectAPIArray.length) {
                await objectAPIArray.pop().remove();
            }
            console.timeEnd('await delete');

            if (domRenderer) {
                console.time('delete dom');
                while (CSS2DObjectArray.length) {
                    const object = CSS2DObjectArray.pop();
                    domRenderer.remove(object.id);
                }
                console.timeEnd('delete dom');
            }
            removeAllController.enable();
            removeAsyncAllController.enable();
        },
        lonGap: 0.05,
        latGap: 0.02,
        help: () => {
            alert('원하는 위치에 마우스를 우클릭하여 테스트합니다.');
        },
        width: 10000,
        height: 10000,
        depth: 10000,
    };

    const object = new THREE.Mesh(
        new THREE.BoxBufferGeometry(API.width, API.height, API.depth),
        new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xffffff * Math.random() })
    );

    const gui = new GUI({ autoPlace: false });
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '2px';
    gui.domElement.style.left = '2px';
    document.body.appendChild(gui.domElement);
    gui.add(API, 'count', 1, 50000, 1);
    gui.add(API, 'latGap', 0.001, 0.1, 0.001);
    gui.add(API, 'lonGap', 0.001, 0.1, 0.001);
    gui.add(API, 'width', 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new THREE.BoxBufferGeometry(API.width, API.height, API.depth);
    });
    gui.add(API, 'height', 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new THREE.BoxBufferGeometry(API.width, API.height, API.depth);
    });
    gui.add(API, 'depth', 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new THREE.BoxBufferGeometry(API.width, API.height, API.depth);
    });
    gui.add(API, 'skipFrameSize', 0, 60, 1).onChange(() => {
        RendererContext.setSkipFrameRequestSize(API.skipFrameSize);
    });
    removeAllController = gui.add(API, 'removeAll');
    removeAsyncAllController = gui.add(API, 'removeAsyncAll');
    gui.add(API, 'help');

    return {
        API: API,
        object: object,
        objectAPIArray: objectAPIArray,
        CSS2DObjectArray: CSS2DObjectArray,
    };
}
