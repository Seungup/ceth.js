import { WorkerRenderer } from "./WorkerRenderer";

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export namespace WorkerRenderSyncer {
    let isRequestRender: boolean = false;

    export const isBusy = () => {
        return isRequestRender;
    };

    /**
     * 다음 장면을 그립니다.
     */
    const render = async () => {
        WorkerRenderer.render();
    };

    /**
     * 다음 장면을 요청합니다.
     */
    export const requestRender = async () => {
        if (!isRequestRender) {
            isRequestRender = true;
            await render();
            isRequestRender = false;
        }
    };
}
