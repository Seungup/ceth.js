import GUI, { Controller } from 'lil-gui';
import { BoxGeometry, DoubleSide, Mesh, MeshLambertMaterial } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RendererContext } from '../../src/App/Context/RendererContext';
import { ObjectAPI } from '../../src/App/Objects/ObjectAPI';

let useDOMRendererController: Controller;
let useWebGLRendererController: Controller;

export function initGUI() {
    const apiArray = new Array<{
        ObjectAPI?: ObjectAPI;
        CSS2DObject?: CSS2DObject;
    }>();

    const API = {
        count: 2500,
        latGap: 0.05,
        removeAll: async () => {
            const useDomRenderer: boolean = useDOMRendererController.getValue(),
                useWebGLRenderer: boolean = useWebGLRendererController.getValue();

            useDOMRendererController.disable();
            useWebGLRendererController.disable();

            const context = RendererContext.getInstance();

            if (!useWebGLRenderer) {
                context.resumeRenderer('DOMRenderer');
            }
            if (!useDomRenderer) {
                context.resumeRenderer('OffscreenRenderer');
                context.resumeRenderer('MultipleOffscreenRenderer');
            }

            const domRenderer = context.getRenderer('DOMRenderer');

            while (apiArray.length) {
                const object = apiArray.pop();

                if (object.ObjectAPI) {
                    await object.ObjectAPI.remove();
                }

                if (object.CSS2DObject && domRenderer) {
                    domRenderer.remove(object.CSS2DObject.id);
                }
            }

            if (!useDomRenderer) {
                context.pauseRenderer('DOMRenderer');
            }
            if (!useWebGLRenderer) {
                context.pauseRenderer('OffscreenRenderer');
                context.pauseRenderer('MultipleOffscreenRenderer');
            }

            useDOMRendererController.enable();
            useWebGLRendererController.enable();
        },
        lonGap: 0.025,
        help: () => {
            alert('원하는 위치에 마우스를 우클릭하여 테스트합니다.');
        },
        width: 10000,
        height: 10000,
        depth: 10000,
        useDOMRenderer: true,
        useWebGLRenderer: true,
    };

    const object = new Mesh(
        new BoxGeometry(API.width, API.height, API.depth),
        new MeshLambertMaterial({ side: DoubleSide })
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
        object.geometry = new BoxGeometry(API.width, API.height, API.depth);
    });
    gui.add(API, 'height', 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new BoxGeometry(API.width, API.height, API.depth);
    });
    gui.add(API, 'depth', 1000, 10000).onFinishChange(() => {
        object.geometry.dispose();
        object.geometry = new BoxGeometry(API.width, API.height, API.depth);
    });
    useDOMRendererController = gui.add(API, 'useDOMRenderer');
    useDOMRendererController.onChange(() => {
        if (API.useDOMRenderer) {
            RendererContext.getInstance().resumeRenderer('DOMRenderer');
        } else {
            RendererContext.getInstance().pauseRenderer('DOMRenderer');
        }
    });
    useWebGLRendererController = gui.add(API, 'useWebGLRenderer');
    useWebGLRendererController.onChange(() => {
        if (API.useWebGLRenderer) {
            RendererContext.getInstance().resumeRenderer('MultipleOffscreenRenderer');
            RendererContext.getInstance().resumeRenderer('OffscreenRenderer');
        } else {
            RendererContext.getInstance().pauseRenderer('MultipleOffscreenRenderer');
            RendererContext.getInstance().pauseRenderer('OffscreenRenderer');
        }
    });
    gui.add(API, 'removeAll');
    gui.add(API, 'help');

    return { API: API, object: object, apiArray: apiArray };
}
