import { ApplicationContext } from './ApplicationContext';
import * as Cesium from 'cesium';
import { RendererMap, RendererTemplate } from '../Components/Renderer';

export namespace RendererContext {
    const rendererMap = new Map<string, { renderer: RendererTemplate; lock: boolean }>();

    export const rockAll = () => {
        rendererMap.forEach((data) => {
            data.lock = true;
        });
    };

    export const lockedFunction = async (callback: { (): void | Promise<void> }) => {
        try {
            RendererContext.rockAll();
            await callback();
        } catch (_) {
        } finally {
            RendererContext.unlockAll();
        }
    };

    export const unlockAll = () => {
        rendererMap.forEach((data) => {
            data.lock = false;
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
                    lock: false,
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
        if (result && !result.lock) {
            return result.renderer as RendererMap[typeof target];
        }
    };

    export const lockRenderer = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result) {
            result.lock = true;
        }
    };

    export const isLocked = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result) {
            return result.lock;
        }
    };

    export const unlockRenderer = <T extends keyof RendererMap>(target: T) => {
        const result = rendererMap.get(target);
        if (result) {
            result.lock = false;
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

    export const render = () => {
        syncScreenRect().then(async () => {
            for (const [_, data] of rendererMap) {
                if (!data.lock) {
                    await data.renderer.render();
                }
            }
        });
    };
}
