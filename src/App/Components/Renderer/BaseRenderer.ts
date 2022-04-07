import * as THREE from 'three';
import { CameraComponent } from '../Camera/CameraComponent';
import { SceneComponent } from '../Scene/SceneComponent';
import { ApplicationContext } from '../../Contexts/ApplicationContext';
import { LocalDataAccessor } from '../../Data/Accessor/Strategy/LocalDataAccessor';
import { ObjectAPI } from '../../Objects/ObjectAPI';
import { Cesium3Synchronization } from '../../Utils/Synchronization';

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
        const camera = CameraComponent.perspectiveCamera;

        camera.aspect = param.aspect;
        camera.far = param.far;
        camera.fov = param.fov;
        camera.near = param.near;
        camera.updateProjectionMatrix();

        return this;
    }

    /**
     * 장면을 렌더링합니다.
     */
    async render() {
        const conetext = ApplicationContext.getInstance();
        if (!conetext.viewer) return;
        if (!this.renderer) return;

        const cvm = new Float64Array(conetext.viewer.camera.viewMatrix),
            civm = new Float64Array(conetext.viewer.camera.inverseViewMatrix),
            camera = CameraComponent.perspectiveCamera,
            scene = SceneComponent.scene;

        Cesium3Synchronization.syncPerspectiveCamera(camera, {
            civm: civm,
            cvm: cvm,
        });

        if (camera.userData.updated) {
            this.renderer.render(scene, camera);
        }
    }

    /**
     * 장면에 오브젝트를 추가합니다.
     * @param object
     */
    async add(object: THREE.Object3D) {
        const scene = SceneComponent.scene;
        scene.add(object);

        return await new ObjectAPI(object.id, new LocalDataAccessor(scene, object.id)).updateAll();
    }
}
