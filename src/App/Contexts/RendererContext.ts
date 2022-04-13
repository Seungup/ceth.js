import { ApplicationContext } from "./ApplicationContext";
import * as Cesium from "cesium";
import { RendererMap, RendererTemplate } from "../Components/Renderer";

interface RendererState {
    lock: boolean;
}
interface RendererValue {
    renderer: RendererTemplate;
    state: RendererState;
    commitedState: RendererState;
}

export namespace RendererContext {
    const rendererArray = new Array<RendererValue>();

    /**
     * 모든 사용가능한 렌더러를 잠금니다.
     */
    export const rockAll = () => {
        for (const { state } of rendererArray) {
            state.lock = true;
        }
    };

    /**
     * 모든 사용 가능한 렌더러의 상태를 저장한 후,
     * 모든 사용 가능한 렌더러를 잠금니다.
     * 그 후, 콜백을 실행시킵니다.
     * 콜백 처리가 완료되면, 저장된 상태로 렌더러를 되돌립니다.
     * @param callback
     */
    export const safeRun = async (callback: { (): void | Promise<void> }) => {
        RendererContext.commit();
        try {
            RendererContext.rockAll();
            await callback();
        } catch (error) {
            console.error(error);
        } finally {
        }
        RendererContext.rollback();
    };

    /**
     * 현재 렌더러들의 상태를 저장합니다.
     */
    export const commit = () => {
        for (const { commitedState, state } of rendererArray) {
            commitedState.lock = state.lock;
        }
    };

    /**
     * 저장된 상태로 렌더러의 상태를 되돌립니다.
     */
    export const rollback = () => {
        for (const { commitedState, state } of rendererArray) {
            state.lock = commitedState.lock;
        }
    };

    /**
     * 사용 가능한 모든 렌더러의 잠금을 해제합니다.
     */
    export const unlockAll = () => {
        for (const { state } of rendererArray) {
            state.lock = false;
        }
    };

    /**
     * 렌더러를 추가합니다.
     * @param renderers
     * @returns
     */
    export const addRenderer = (
        ...renderers: typeof RendererTemplate[] | RendererTemplate[]
    ) => {
        let renderer: RendererTemplate;
        let data: typeof RendererTemplate | RendererTemplate;

        for (let i = 0, len = renderers.length; i < len; i++) {
            data = renderers[i];

            if (typeof data === "function") {
                renderer = new data();
            } else {
                renderer = data;
            }

            rendererArray.push({
                renderer: renderer,
                state: { lock: false },
                commitedState: { lock: false },
            });
        }

        return RendererContext;
    };

    /**
     * 렌더러를 가져옵니다.
     * @param target
     * @throws
     * @returns
     */
    export const getRenderer = <T extends keyof RendererMap>(target: T) => {
        for (const { renderer } of rendererArray) {
            if (renderer.name === target) {
                return renderer as RendererMap[T];
            }
        }
    };

    /**
     * 렌더러를 잠급니다.
     * @param target
     */
    export const lockRenderer = <T extends keyof RendererMap>(target: T) => {
        for (const { renderer, state } of rendererArray) {
            if (renderer.name === target) {
                state.lock = true;
                break;
            }
        }
    };

    /**
     * 잠궈진 렌더러인지 확인합니다.
     * @param target
     * @returns
     */
    export const isLocked = <T extends keyof RendererMap>(target: T) => {
        for (const { renderer, state } of rendererArray) {
            if (renderer.name === target) {
                return state.lock;
            }
        }
    };

    /**
     * 렌더러를 잠금 해제합니다.
     * @param target
     */
    export const unlockRenderer = <T extends keyof RendererMap>(target: T) => {
        for (const { renderer, state } of rendererArray) {
            if (renderer.name === target) {
                state.lock = false;
                break;
            }
        }
    };

    /**
     * 렌더러를 삭제합니다.
     * @param target
     * @returns
     */
    export const removeRenderer = <T extends keyof RendererMap>(target: T) => {
        const index = rendererArray.findIndex(({ renderer }) => {
            return renderer.name === target;
        });

        if (index !== -1) {
            // prettier-ignore
            [
                rendererArray[index], 
                rendererArray[rendererArray.length - 1]
            ] = [
                rendererArray[rendererArray.length - 1],
                rendererArray[index],
            ];
            rendererArray.pop();
        }
    };

    let _oldWidth: number | undefined;
    let _oldHeight: number | undefined;

    /**
     * 화면의 크기에 맞춰 렌더러들을 동기화합니다.
     * @returns
     */
    const syncScreenRect = async () => {
        const { viewer } = ApplicationContext;

        if (!viewer) return;

        const [width, height] = [
            viewer.canvas.clientWidth,
            viewer.canvas.clientHeight,
        ];

        if (_oldHeight !== height || _oldWidth !== width) {
            const param = {
                fov: Cesium.Math.toDegrees(
                    (viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy
                ),
                near: viewer.camera.frustum.near,
                far: viewer.camera.frustum.far,
                aspect: width / height,
            };
            for (const { renderer } of rendererArray) {
                await renderer.setCamera(param);
                await renderer.setSize(width, height);
            }
        }

        [_oldWidth, _oldHeight] = [width, height];
    };

    /**
     * 장면을 렌더합니다.
     *
     * 렌더러의 잠김 여부와 관계없이 동작합니다.
     */
    export const render = async () => {
        await syncScreenRect();
        for (const { renderer } of rendererArray) {
            renderer.render();
        }
    };
}
