import { PerspectiveCamera } from "three";
import { PerspectiveCameraInitParam } from "../Renderer/BaseRenderer";

export namespace CameraComponent {
    export const perspectiveCamera = new PerspectiveCamera();

    export namespace API {
        /**
         * 카메라를 초기화합니다.
         * @param param
         */
        export const initCamera = (param: PerspectiveCameraInitParam) => {
            perspectiveCamera.aspect = param.aspect;
            perspectiveCamera.far = param.far;
            perspectiveCamera.near = param.near;
            perspectiveCamera.fov = param.fov;
            perspectiveCamera.updateProjectionMatrix();
        };
    }
}
