import { Matrix3, Object3D, Vector3 } from 'three';
import { CameraComponent } from '../../../../Camera/CameraComponent';
import { WebGLRendererComponent } from '../../WebGLRenderer';
import { SceneComponent } from '../../../../Scene/SceneComponent';
export namespace WorkerRenderer {
    // 지구 뒷편 오브젝트 렌더링 여부
    let renderBehindEarthOfObjects: boolean = false;

    const normalMatrix = new Matrix3();
    const tempVector = new Vector3();
    const cameraToPoint = new Vector3();
    /**
     * 장면을 렌더링합니다.
     */
    export const render = () => {
        if (WebGLRendererComponent.renderer) {
            if (!renderBehindEarthOfObjects) {
                normalMatrix.getNormalMatrix(CameraComponent.perspectiveCamera.matrixWorldInverse);
                SceneComponent.scene.traverse(_setObjectVisible);
            }

            WebGLRendererComponent.renderer.render(
                SceneComponent.scene,
                CameraComponent.perspectiveCamera
            );
        }
    };

    export namespace API {
        /**
         * 지구 뒷편에 존재하는 오브젝트의 렌더 여부를 결정합니다.
         *
         * @param visible 가시 여부
         */
        export const setRenderBehindEarthOfObjects = (visible: boolean) => {
            renderBehindEarthOfObjects = visible;
        };
    }

    const zeroVector = new Vector3(0, 0, 0);
    let dot: number | undefined;
    /**
     * 오브젝트의 지구 뒷면 렌더링을 제어합니다.
     *
     * @param object
     * @returns
     */
    const _setObjectVisible = (object: Object3D) => {
        // 위치를 가지는 오브젝트만 선정
        if (object.position.equals(zeroVector)) return;

        cameraToPoint
            .copy(object.position)
            .applyMatrix4(CameraComponent.perspectiveCamera.matrixWorldInverse)
            .normalize();

        dot = tempVector.copy(object.position).applyMatrix3(normalMatrix).dot(cameraToPoint);

        object.visible = dot < 0;
    };
}
