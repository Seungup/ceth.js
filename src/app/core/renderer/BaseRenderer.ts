import * as THREE from 'three';
import { ApplicationContext } from '../../Context/ApplicationContext';
import { LocalDataAccessStrategy } from '../../Data/Accessor/Strategy/LocalDataAccessor';
import { ObjectAPI } from '../../Objects/ObjectAPI';
import { Cesium3Synchronization } from '../utils/Synchronization';

export interface PerspectiveCameraInitParam {
    aspect: number;
    far: number;
    near: number;
    fov: number;
}

export interface IRenderer {
    setSize(width: number, height: number): void;
    render(scene: THREE.Scene, camera: THREE.Camera): void;
    domElement: HTMLElement;
}

export interface IRendererTemplate {
    setSize(width: number, height: number, updateStyle: boolean): Promise<this>;
    setCamera(param: PerspectiveCameraInitParam): Promise<this>;
    render(): Promise<void>;
    add(...object: THREE.Object3D[]): Promise<ObjectAPI>;
}

export class BaseRenderer implements IRendererTemplate {
    name: string = 'RendererTemplate';
    protected renderer: IRenderer | undefined;
    protected camera: THREE.Camera = new THREE.PerspectiveCamera();
    protected scene: THREE.Scene = new THREE.Scene();

    /**
     * 렌더러의 크기를 설정합니다.
     * @param width
     * @param height
     */
    async setSize(width: number, height: number) {
        this.renderer?.setSize(width, height);
        return this;
    }

    /**
     * 카메라의 설정값을 변경합니다.
     * @param param
     */
    async setCamera(param: PerspectiveCameraInitParam) {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = param.aspect;
            this.camera.far = param.far;
            this.camera.fov = param.fov;
            this.camera.near = param.near;
            this.camera.updateProjectionMatrix();
        }
        return this;
    }

    /**
     * 장면을 렌더링합니다.
     */
    async render() {
        const conetext = ApplicationContext.getInstance();
        if (!conetext.viewer) return;
        if (!this.renderer) return;

        const cvm = new Float64Array(conetext.viewer.camera.viewMatrix);
        const civm = new Float64Array(conetext.viewer.camera.inverseViewMatrix);

        if (this.camera instanceof THREE.PerspectiveCamera) {
            Cesium3Synchronization.syncPerspectiveCamera(this.camera, { civm: civm, cvm: cvm });
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 장면에 오브젝트를 추가합니다.
     * @param object
     */
    async add(object: THREE.Object3D) {
        this.scene.add(object);
        return await new ObjectAPI(
            object.id,
            new LocalDataAccessStrategy(this.scene, object.id)
        ).updateAll();
    }
}
