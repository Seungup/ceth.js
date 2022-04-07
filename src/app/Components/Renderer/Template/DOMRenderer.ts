import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { ApplicationContext } from '../../../Context/ApplicationContext';
import { IWGS84, WGS84_ACTION } from '../../../Math';
import { Cesium3Synchronization } from '../../../Utils/Synchronization';
import { ObjectData } from '../../../Data/ObjectData';
import { SceneComponent } from '../../Scene/SceneComponent';
import { BaseRenderer } from '../BaseRenderer';

// TODO : 단일책임의 원칙에 따라 렌더러에서는 렌더링 관련된 기능만을 수행할 수 있도록, 적절하지 않은 함수는 따로 뺄 수 있도록 변경한다,
// TODO : 렌더러 클래스의 맴버 변수 scene, camera는 약한 관계를 갖도록 변경한다. 다자인 패턴중에서 전략 패턴을 쓰면 괜찮을 것 같다.

export class DOMRenderer extends BaseRenderer {
    constructor() {
        super();
        this.name = 'DOMRenderer';
        this.renderer = new CSS2DRenderer();
        const context = ApplicationContext.getInstance();
        if (context.viewer) {
            this.renderer.setSize(context.viewer.canvas.width, context.viewer.canvas.height);
        }
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0px';

        context.container.appendChild(this.renderer.domElement);
    }

    async addText(text: string, wgs84: IWGS84, action: WGS84_ACTION = WGS84_ACTION.NONE) {
        const div = document.createElement('div');

        div.className = 'label';
        div.textContent = text;

        div.style.textAlign = 'center';
        div.style.alignItems = 'center';
        div.style.color = 'black';
        div.style.backgroundColor = 'white';
        div.style.marginTop = '-1em';
        div.style.marginLeft = '-1em';
        div.style.marginRight = '-1em';
        div.style.marginBottom = '-1em';
        div.style.whiteSpace = 'pre';

        const object = new CSS2DObject(div);

        ObjectData.setPositionRotationScaleByObject3D(object);
        const scene = SceneComponent.scene;
        Cesium3Synchronization.syncObject3DPosition(object, wgs84, action).then((result) => {
            scene.add(result.object);
        });

        return object;
    }

    async updatePosition(
        id: number | THREE.Object3D,
        position: IWGS84,
        positionAction: WGS84_ACTION
    ) {
        let object: THREE.Object3D | undefined;
        if (typeof id === 'number') {
            object = SceneComponent.scene.getObjectById(id);
        } else {
            object = id;
        }

        if (object) {
            const prs = ObjectData.API.getPositionRotationScale(object.id);

            if (prs) {
                object.position.copy(prs.position);
                object.rotation.copy(prs.rotation);
                object.scale.copy(prs.scale);
            }
            await Cesium3Synchronization.syncObject3DPosition(object, position, positionAction);
        }
    }

    remove(id: number) {
        const object = SceneComponent.scene.getObjectById(id);
        if (object) {
            SceneComponent.scene.remove(object);
        }
    }
}
