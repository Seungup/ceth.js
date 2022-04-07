import { ApplicationContext } from './ApplicationContext';
import * as Cesium from 'cesium';
import { RendererMap, RendererTemplate } from '../Components/Renderer';

export class RendererContext {
    private static instance: RendererContext;

    private constructor() {}

    static render() {
        RendererContext.getInstance().render();
    }

    private rendererMap = new Map<
        string,
        { renderer: RendererTemplate; use: boolean }
    >();
    static getInstance(): RendererContext {
        if (!RendererContext.instance) {
            RendererContext.instance = new RendererContext();
        }
        return RendererContext.instance;
    }

    /**
     * 렌더러를 추가합니다.
     * @param renderers
     * @returns
     */
    addRenderer(...renderers: typeof RendererTemplate[]) {
        renderers.forEach((renderer) => {
            if (this.rendererMap.has(renderer.name)) {
                console.error(`${renderer.name} is already exist.`);
            } else {
                this.rendererMap.set(renderer.name, {
                    renderer: new renderer(),
                    use: true,
                });
            }
        });
        return this;
    }

    /**
     * 렌더러를 가져옵니다.
     * @param target
     * @throws
     * @returns
     */
    getRenderer<T extends keyof RendererMap>(target: T) {
        const result = this.rendererMap.get(target);
        if (result && result.use) {
            return result.renderer as RendererMap[typeof target];
        }
    }

    pauseRenderer<T extends keyof RendererMap>(target: T) {
        const result = this.rendererMap.get(target);
        if (result) {
            result.use = false;
        }
    }

    isPaused<T extends keyof RendererMap>(target: T) {
        const result = this.rendererMap.get(target);
        if (result) {
            return !result.use;
        }
    }

    resumeRenderer<T extends keyof RendererMap>(target: T) {
        const result = this.rendererMap.get(target);
        if (result) {
            result.use = true;
        }
    }

    /**
     * 렌더러를 삭제합니다.
     * @param target
     * @returns
     */
    removeRenderer<T extends keyof RendererMap>(target: T) {
        return this.rendererMap.delete(target);
    }

    private _oldWidth: number | undefined;
    private _oldHeight: number | undefined;
    private async syncScreenRect() {
        const viewer = ApplicationContext.getInstance().viewer;
        if (!viewer) return;

        const width = viewer.canvas.clientWidth;
        const height = viewer.canvas.clientHeight;

        if (this._oldHeight !== height || this._oldWidth !== width) {
            const param = {
                fov: Cesium.Math.toDegrees(
                    (viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy
                ),
                near: viewer.camera.frustum.near,
                far: viewer.camera.frustum.far,
                aspect: width / height,
            };

            for (const [_, data] of this.rendererMap) {
                if (data.use) {
                    await data.renderer.setCamera(param);
                    await data.renderer.setSize(width, height);
                }
            }
        }

        this._oldWidth = width;
        this._oldHeight = height;
    }

    render() {
        this.syncScreenRect().then(async () => {
            for (const [_, data] of this.rendererMap) {
                if (data.use) {
                    await data.renderer.render();
                }
            }
        });
    }
}
