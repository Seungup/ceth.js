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
     * 최대 스킵 가능한 프레임 개수입니다.
     */
    let MAXIUM_SKIBBLE_FRAME_COUNT = 60;

    let skipedFrame = 0;
    /**
     * 장면을 렌더링합니다.
     */
    export const render = () => {
        /**
         * 렌더링 전략
         *
         * 1. 카메라의 업데이트가 되지 않았을 경우, 렌더를 스킵한다.
         * 2. 스킵된 프레임은 기록되며, 특정 개수 이상이 되었을 경우 1회 렌더한 후 기록된 값은 초기화한다.
         */
        if (WebGLRendererComponent.renderer) {
            const camera = CameraComponent.perspectiveCamera;
            if (!renderBehindEarthOfObjects) {
                normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
                SceneComponent.scene.traverse(_setObjectVisible);
            }

            if (
                (typeof camera.userData.updated === 'boolean' &&
                    camera.userData.updated === true) ||
                skipedFrame >= MAXIUM_SKIBBLE_FRAME_COUNT
            ) {
                WebGLRendererComponent.renderer.render(SceneComponent.scene, camera);
                skipedFrame = 0;
            } else {
                skipedFrame++;
            }
            camera.userData.updated = false;
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

        /**
         * 최대 스킵 가능한 프레임의 개수를 설정합니다.
         *
         * @default 60
         * @param count
         */
        export const setMaxiumSkibbleFrameCount = (count: number) => {
            MAXIUM_SKIBBLE_FRAME_COUNT = -1 > count ? 0 : count;
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
