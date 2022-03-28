import { Object3D, PerspectiveCamera } from 'three';
import { CT_WGS84, IWGS84, WGS84_TYPE } from '../../math';

export namespace Cesium3Synchronization {
    export interface ISyncPerspectiveCameraParam {
        cvm: Float64Array;
        civm: Float64Array;
    }

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

    export const syncObject3DPosition = (
        object: Object3D,
        position: IWGS84,
        positionType: WGS84_TYPE
    ) => {
        const wgs84 = new CT_WGS84(position, positionType);

        object.applyMatrix4(wgs84.getMatrix4());

        return wgs84.toIWGS84();
    };
}
