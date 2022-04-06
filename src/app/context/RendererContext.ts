import { RendererMap, RendererTemplate } from '../core';
import { ApplicationContext } from './ApplicationContext';
import * as Cesium from 'cesium';

export class RendererContext {
    private static instance: RendererContext;

    private constructor() {}

    private rendererMap = new Map<string, RendererTemplate>();
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
                this.rendererMap.set(renderer.name, new renderer());
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
        const renderer = this.rendererMap.get(target);
        if (renderer) {
            return renderer as RendererMap[typeof target];
        }
        throw new Error(`${target} is not exist on RenderMap.`);
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

            for (const [_, renderer] of this.rendererMap) {
                await renderer.setCamera(param);
                await renderer.setSize(width, height);
            }
        }

        this._oldWidth = width;
        this._oldHeight = height;
    }

    /**
     * 화면을 갱신합니다.
     */
    async doRender() {
        await this.syncScreenRect();
        for (const [_, renderer] of this.rendererMap) {
            await renderer.render();
        }
    }
}
