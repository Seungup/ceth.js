import { Object3D, PerspectiveCamera } from 'three';
import { CT_WGS84, IWGS84, WGS84_ACTION } from '../../math';

export namespace Cesium3Synchronization {
    export interface ISyncPerspectiveCameraParam {
        cvm: Float64Array;
        civm: Float64Array;
    }

    /**
     * threejs의 카메라의 행렬을 cesium camera와 동기화합니다.
     *
     * @param camera threejs camera
     * @param param cesium camera matrix param
     */
    export const syncPerspectiveCamera = (
        camera: PerspectiveCamera,
        param: ISyncPerspectiveCameraParam
    ) => {
        camera.matrixAutoUpdate = false;

        // prettier-ignore
        camera.matrixWorld.set(
            param.civm[ 0], param.civm[ 4], param.civm[ 8], param.civm[12],
            param.civm[ 1], param.civm[ 5], param.civm[ 9], param.civm[13],
            param.civm[ 2], param.civm[ 6], param.civm[10], param.civm[14],
            param.civm[ 3], param.civm[ 7], param.civm[11], param.civm[15]
        );
        // prettier-ignore
        camera.matrixWorldInverse.set(
            param.cvm[ 0], param.cvm[ 4], param.cvm[ 8], param.cvm[12],
            param.cvm[ 1], param.cvm[ 5], param.cvm[ 9], param.cvm[13],
            param.cvm[ 2], param.cvm[ 6], param.cvm[10], param.cvm[14],
            param.cvm[ 3], param.cvm[ 7], param.cvm[11], param.cvm[15]
        );

        camera.updateProjectionMatrix();
    };

    /**
     * threejs 의 오브젝트의 위치를 cesium 지구 표면의 위치와 동기화합니다.
     * @param object threejs object3d
     * @param position wgs84
     * @param positionAction
     * @returns
     */
    export const syncObject3DPosition = (object: Object3D, wgs84: IWGS84, action: WGS84_ACTION) => {
        const location = new CT_WGS84(wgs84, action);

        object.applyMatrix4(location.getMatrix4());

        return location.toIWGS84();
    };
}
