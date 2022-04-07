import { Graphic } from '../graphic';

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export namespace RenderSyncer {
    let isRequestRender: boolean = false;

    /**
     * 다음 장면을 그립니다.
     */
    const render = () => {
        Graphic.render();
        isRequestRender = false;
    };

    /**
     * 다음 장면을 요청합니다.
     */
    export const requestRender = () => {
        if (!isRequestRender) {
            isRequestRender = true;
            render();
        }
    };
}