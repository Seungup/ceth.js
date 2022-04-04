import { Context } from '../../context';
import type { RendererTemplate } from './template';
import * as Cesium from 'cesium';

export class RendererContext {
    private rendererMap = new Map<typeof RendererTemplate, RendererTemplate>();

    addRenderer(...renderers: typeof RendererTemplate[]) {
        renderers.forEach((renderer) => {
            if (this.rendererMap.has(renderer)) {
                console.error(`${renderer.name} is already exist.`);
            } else {
                this.rendererMap.set(renderer, new renderer());
            }
        });
        return this;
    }

    getRenderer(renderer: typeof RendererTemplate) {
        return this.rendererMap.get(renderer);
    }

    removeRenderer(renderer: typeof RendererTemplate) {
        return this.rendererMap.delete(renderer);
    }

    private _oldWidth: number | undefined;
    private _oldHeight: number | undefined;
    private update() {
        if (!Context.viewer) return;

        const width = Context.viewer.canvas.clientWidth;
        const height = Context.viewer.canvas.clientHeight;

        if (this._oldHeight !== height || this._oldWidth !== width) {
            const param = {
                fov: Cesium.Math.toDegrees(
                    (Context.viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy
                ),
                near: Context.viewer.camera.frustum.near,
                far: Context.viewer.camera.frustum.far,
                aspect: width / height,
            };

            for (const [_, renderer] of this.rendererMap) {
                renderer.setCamera(param);
                renderer.setSize(width, height);
            }
        }

        this._oldWidth = width;
        this._oldHeight = height;
    }

    doRender(): void {
        this.update();
        for (const [_, renderer] of this.rendererMap) {
            renderer.render();
        }
    }
}
