import { Cesium3Synchronization } from '../synchronization';
import { Graphic } from '../graphic';

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export namespace RenderQueue {
    let param: Cesium3Synchronization.ISyncPerspectiveCameraParam | undefined;
    let isRequestRender: boolean = false;

    /**
     * 다음 장면을 그립니다.
     */
    const render = () => {
        if (param) {
            Graphic.render(param);
            param = undefined;
        }
        isRequestRender = false;
    };

    /**
     * 다음 장면을 요청합니다.
     * @param param 렌더링 파라미터
     */
    export const requestRender = (
        syncCameraParam: Cesium3Synchronization.ISyncPerspectiveCameraParam
    ) => {
        if (!isRequestRender) {
            isRequestRender = true;
            param = syncCameraParam;
            render();
        }
    };
}
