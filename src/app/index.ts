import { Viewer } from 'cesium';
import { ApplicationContext, RendererContext } from './context';
import { DOMRenderer, OffscreenRenderer } from './core';
import { Utils } from './utils';
export * from './objects';
export * from './core';

export namespace Cesium3 {
    export const init = (viewer: Viewer) => {
        ApplicationContext.getInstance().viewer = viewer;
    };

    export const Context = {
        ApplicationContext: ApplicationContext,
        RendererContext: RendererContext,
    } as const;

    export const Renderers = {
        DOMRenderer: DOMRenderer,
        OffscreenRendererProxy: OffscreenRenderer,
    } as const;

    export const CesiumUtils = {
        ...Utils,
    } as const;

    export const render = () => {
        RendererContext.getInstance().doRender();
        ApplicationContext.getInstance().viewer?.render();
    };
}
