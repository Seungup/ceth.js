import { PerspectiveCamera } from 'three';

export namespace CameraComponent {
    export const perspectiveCamera = new PerspectiveCamera();

    export namespace API {
        export interface CameraInitParam {
            aspect: number;
            far: number;
            near: number;
            fov: number;
        }
        /**
         * 렌더러의 카메라를 초기화합니다.
         * @param param
         */
        export const initCamera = (param: CameraInitParam) => {
            perspectiveCamera.aspect = param.aspect;
            perspectiveCamera.far = param.far;
            perspectiveCamera.near = param.near;
            perspectiveCamera.fov = param.fov;
            perspectiveCamera.updateProjectionMatrix();
        };
    }
}
