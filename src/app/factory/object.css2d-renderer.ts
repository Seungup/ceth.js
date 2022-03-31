import * as Cesium from 'cesium';
import { Object3D, PerspectiveCamera, Scene } from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CameraComponent } from '../../core/API/components';
import { Cesium3Synchronization } from '../../core/API/synchronization';
import { CT_WGS84, IWGS84, WGS84_TYPE } from '../../math';
import { ObjectData } from '../../core/API/object-data';

export class ObjectCSS2DRenderer {
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

    add(text: string, position: IWGS84, positionType: WGS84_TYPE) {
        const div = document.createElement('div');

        div.className = 'label';
        div.textContent = text;

        div.style.color = 'black';
        div.style.backgroundColor = 'white';
        div.style.marginTop = '-1em';
        div.style.marginLeft = '-1em';
        div.style.marginRight = '-1em';
        div.style.marginBottom = '-1em';

        const object = new CSS2DObject(div);

        ObjectData.setPositionRotationScaleByObject3D(object);

        object.applyMatrix4(new CT_WGS84(position, positionType).getMatrix4());

        this.scene.add(object);

        return object;
    }

    updatePosition(id: number | Object3D, position: IWGS84, positionType: WGS84_TYPE) {
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

            object.applyMatrix4(new CT_WGS84(position, positionType).getMatrix4());
        }
    }

    remove(id: number) {
        const object = this.scene.getObjectById(id);
        if (object) {
            this.scene.remove(object);
        }
    }

    render() {
        const w = this.viewer.canvas.width;
        const h = this.viewer.canvas.height;

        const param: CameraComponent.API.CameraInitParam = {
            fov: Cesium.Math.toDegrees(
                (this.viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy
            ),
            near: this.viewer.camera.frustum.near,
            far: this.viewer.camera.frustum.far,
            aspect: w / h,
        };

        this.camera.aspect = param.aspect;
        this.camera.far = param.far;
        this.camera.near = param.near;
        this.camera.fov = param.fov;
        this.camera.updateProjectionMatrix();

        const cvm = new Float64Array(this.viewer.camera.viewMatrix);
        const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);

        Cesium3Synchronization.syncPerspectiveCamera(this.camera, { civm: civm, cvm: cvm });
        this.labelRenderer.render(this.scene, this.camera);
    }
}
