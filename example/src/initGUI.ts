import GUI from 'lil-gui';
import { BoxGeometry, DoubleSide, Mesh, MeshLambertMaterial } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RendererContext } from '../../src/App/Context/RendererContext';
import { ObjectAPI } from '../../src/App/Objects/ObjectAPI';

export function initGUI() {
    const apiArray = new Array<{
        ObjectAPI?: ObjectAPI;
        CSS2DObject?: CSS2DObject;
    }>();

    const API = {
        count: 2500,
        latGap: 0.05,
        removeAll: async () => {
            while (apiArray.length) {
                const object = apiArray.shift();
                if (object.ObjectAPI) {
                    await object.ObjectAPI.remove();
                }
                if (object.CSS2DObject) {
                    RendererContext.getInstance()
                        .getRenderer('DOMRenderer')
                        .remove(object.CSS2DObject.id);
                }
            }
        },
        lonGap: 0.025,
        help: () => {
            alert('원하는 위치에 마우스를 우클릭하여 테스트합니다.');
        },
        width: 10000,
        height: 10000,
        depth: 10000,
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
    gui.add(API, 'removeAll');
    gui.add(API, 'help');

    return { API: API, object: object, apiArray: apiArray };
}
