import { OffscreenRenderer } from "./OffscreenRenderer";

const State = {
    IDLE: 0,
    RUNNING: 1,
} as const;

class RenderQueue {
    private state: number = State.IDLE;
    private renderTask: { (): void } | undefined;

    startIfTaskExist() {
        if (this.state !== State.RUNNING) {
            this.state = State.RUNNING;
            (async () => {
                await new Promise((resolve) => {
                    this.execute().then(resolve);
                });
            })();
        }
    }

    enqueueIfIDLEState() {
        if (this.state === State.IDLE && this.renderTask === undefined) {
            this.renderTask = OffscreenRenderer.render;
        }
    }

    private async execute() {
        if (this.renderTask) {
            // 해당 렌더 테스크를 끝내고, IDLE 상태로 돌아간다.
            return await Promise.resolve(this.renderTask()).finally(() => {
                this.renderTask = undefined;
                this.state = State.IDLE;
            });
        }
    }
}

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export namespace OffscreenRenderSyncer {
    const renderQueue = new RenderQueue();

    /**
     * 다음 장면을 요청합니다.
     */
    export const requestRender = () => {
        renderQueue.enqueueIfIDLEState();
        renderQueue.startIfTaskExist();
    };
}
