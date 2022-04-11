import { ApplicationContext } from "./ApplicationContext";
import * as Cesium from "cesium";
import { RendererMap, RendererTemplate } from "../Components/Renderer";

interface RendererState {
    lock: boolean;
}
interface RendererValue {
    renderer: RendererTemplate;
    state: RendererState;
}

export namespace RendererContext {
    const rendererMap = new Map<string, RendererValue>();

    /**
     * 모든 사용가능한 렌더러를 잠금니다.
     */
    export const rockAll = () => {
        rendererMap.forEach((data) => {
            data.state.lock = true;
        });
    };

    /**
     * 모든 사용 가능한 렌더러의 상태를 저장한 후,
     * 모든 사용 가능한 렌더러를 잠금니다.
     * 그 후, 콜백을 실행시킵니다.
     * 콜백 처리가 완료되면, 저장된 상태로 렌더러를 되돌립니다.
     * @param callback
     */
    export const safeRun = async (callback: { (): void | Promise<void> }) => {
        try {
            RendererContext.commit();
            RendererContext.rockAll();
            await callback();
        } catch (error) {
            console.error(error);
        } finally {
            RendererContext.rollback();
        }
    };

    /**
     * 렌더러의 상태값을 저장하는 논리맵
     */
    const commitedState = new Map<string, RendererState>();
    /**
     * 현재 렌더러들의 상태를 저장합니다.
     */
    export const commit = () => {
        commitedState.clear();
        rendererMap.forEach((value, key) => {
            commitedState.set(key, value.state);
        });
    };

    /**
     * 저장된 렌더러들의 상태를 초기화합니다.
     */
    export const clearCommitedData = () => {
        commitedState.clear();
    };

    /**
     * 저장된 상태로 렌더러의 상태를 되돌립니다.
     */
    export const rollback = () => {
        let data: RendererValue | undefined;
        commitedState.forEach((value, key) => {
            data = rendererMap.get(key);
            if (data) {
                data.state = value;
            }
        });
    };

    /**
     * 사용 가능한 모든 렌더러의 잠금을 해제합니다.
     */
    export const unlockAll = () => {
        rendererMap.forEach((data) => {
            data.state.lock = false;
        });
    };

    /**
     * 렌더러를 추가합니다.
     * @param renderers
     * @returns
     */
    export const addRenderer = (...renderers: typeof RendererTemplate[]) => {
        renderers.forEach((renderer) => {
            if (rendererMap.has(renderer.name)) {
                console.error(`${renderer.name} is already exist.`);
            } else {
                rendererMap.set(renderer.name, {
                    renderer: new renderer(),
                    state: { lock: false },
                });
            }
        });

        return RendererContext;
    };

    /**
     * 렌더러를 가져옵니다.
     * @param target
     * @throws
     * @returns
     */
    export const getRenderer = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result && !result.state.lock) {
            return result.renderer as RendererMap[typeof target];
        }
    };

    /**
     * 렌더러를 잠급니다.
     * @param target
     */
    export const lockRenderer = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result) {
            result.state.lock = true;
        }
    };

    /**
     * 잠궈진 렌더러인지 확인합니다.
     * @param target
     * @returns
     */
    export const isLocked = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result) {
            return result.state.lock;
        }
    };

    /**
     * 렌더러를 잠금 해제합니다.
     * @param target
     */
    export const unlockRenderer = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result) {
            result.state.lock = false;
        }
    };

    /**
     * 렌더러를 삭제합니다.
     * @param target
     * @returns
     */
    export const removeRenderer = <T extends keyof RendererMap>(target: T) => {
        const data = rendererMap.get(target);
        if (data) {
            data.renderer;
        }

        return rendererMap.delete(target);
    };

    let _oldWidth: number | undefined;
    let _oldHeight: number | undefined;

    /**
     * 화면의 크기에 맞춰 렌더러들을 동기화합니다.
     * @returns
     */
    const syncScreenRect = async () => {
        const viewer = ApplicationContext.getInstance().viewer;
        if (!viewer) return;

        const width = viewer.canvas.clientWidth;
        const height = viewer.canvas.clientHeight;

        if (_oldHeight !== height || _oldWidth !== width) {
            const param = {
                fov: Cesium.Math.toDegrees(
                    (viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy
                ),
                near: viewer.camera.frustum.near,
                far: viewer.camera.frustum.far,
                aspect: width / height,
            };

            for (const [_, data] of rendererMap) {
                await data.renderer.setCamera(param);
                await data.renderer.setSize(width, height);
            }
        }

        _oldWidth = width;
        _oldHeight = height;
    };

    /**
     * 장면을 렌더합니다.
     *
     * 렌더러의 잠김 여부와 관계없이 동작합니다.
     */
    export const render = () => {
        syncScreenRect().then(() => {
            for (const [_, { renderer }] of rendererMap) {
                renderer.render();
            }
        });
    };
}
