import GUI from 'lil-gui';
import { BoxGeometry, DoubleSide, Mesh, MeshLambertMaterial } from 'three';
import { ObjectAPI } from '../../src';

export function initGUI() {
    const objectArray = new Array<ObjectAPI>();

    const API = {
        count: 2500,
        latGap: 0.05,
        clear: async () => {
            while (objectArray.length) {
                await objectArray.pop().remove();
            }
        },
        lonGap: 0.05,
        help: () => {
            alert('원하는 위치에 마우스를 우클릭하여 테스트합니다.');
        },
        width: 1500,
        height: 1500,
        depth: 1500,
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
    gui.add(API, 'latGap', 0.001, 0.01, 0.001);
    gui.add(API, 'lonGap', 0.001, 0.01, 0.001);
    gui.add(API, 'clear');
    gui.add(API, 'help');
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

    return { API: API, object: object, objectArray: objectArray };
}
