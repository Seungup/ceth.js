import * as Cesium from 'cesium';
import { Object3D, PerspectiveCamera, Scene } from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CameraComponent } from '../../../core/API/components';
import { ObjectData } from '../../../core/API/object-data';
import { Cesium3Synchronization } from '../../../core/API/synchronization';
import { CT_WGS84, IWGS84, WGS84_ACTION } from '../../../math';
import { IBaseRenderer } from './BaseRenderer';

export class Object3DCSS2DRenderer implements IBaseRenderer {
    private readonly labelRenderer = new CSS2DRenderer();
    private readonly camera = new PerspectiveCamera();
    private readonly scene = new Scene();

    constructor(private readonly viewer: Cesium.Viewer, container: HTMLDivElement) {
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(this.viewer.canvas.width, this.viewer.canvas.height);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.camera.layers.enableAll();
        this.camera.layers.toggle(1);
        container.appendChild(this.labelRenderer.domElement);
    }

    add(text: string, position: { wgs84: IWGS84; action: WGS84_ACTION }) {
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

        object.applyMatrix4(new CT_WGS84(position.wgs84, position.action).getMatrix4());

        this.scene.add(object);

        return object;
    }

    updatePosition(id: number | Object3D, position: IWGS84, positionAction: WGS84_ACTION) {
        let object: Object3D | undefined;
        if (typeof id === 'number') {
            object = this.scene.getObjectById(id);
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

            object.applyMatrix4(new CT_WGS84(position, positionAction).getMatrix4());
        }
    }

    remove(id: number) {
        const object = this.scene.getObjectById(id);
        if (object) {
            this.scene.remove(object);
        }
    }

    setSize(width: number, height: number): void {
        this.labelRenderer.setSize(width, height);
    }

    setCamera(param: CameraComponent.API.PerspectiveCameraInitParam): void {
        this.camera.aspect = param.aspect;
        this.camera.far = param.far;
        this.camera.fov = param.fov;
        this.camera.near = param.near;
        this.camera.updateProjectionMatrix();
    }

    render() {
        const cvm = new Float64Array(this.viewer.camera.viewMatrix);
        const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);
        Cesium3Synchronization.syncPerspectiveCamera(this.camera, { civm: civm, cvm: cvm });
        this.labelRenderer.render(this.scene, this.camera);
    }
}
