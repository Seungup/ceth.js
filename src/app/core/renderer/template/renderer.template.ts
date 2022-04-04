import * as THREE from 'three';
import { Context } from '../../../context';
import { Cesium3Synchronization } from './OffscreenRenderer/core/API/synchronization';

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
    setSize(width: number, height: number, updateStyle: boolean): void;
    setCamera(param: PerspectiveCameraInitParam): void;
    render(): void;
    add(...object: THREE.Object3D[]): void;
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
    setSize(width: number, height: number): void {
        this.renderer?.setSize(width, height);
    }

    /**
     * 카메라의 설정값을 변경합니다.
     * @param param
     */
    setCamera(param: PerspectiveCameraInitParam): void {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = param.aspect;
            this.camera.far = param.far;
            this.camera.fov = param.fov;
            this.camera.near = param.near;
            this.camera.updateProjectionMatrix();
        }
    }

    /**
     * 장면을 렌더링합니다.
     */
    render(): void {
        if (!Context.viewer) return;
        if (!this.renderer) return;

        const cvm = new Float64Array(Context.viewer.camera.viewMatrix);
        const civm = new Float64Array(Context.viewer.camera.inverseViewMatrix);

        if (this.camera instanceof THREE.PerspectiveCamera) {
            Cesium3Synchronization.syncPerspectiveCamera(this.camera, { civm: civm, cvm: cvm });
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 장면에 오브젝트를 추가합니다.
     * @param object
     */
    add(...object: THREE.Object3D[]): void {
        this.scene.add(...object);
    }
}
