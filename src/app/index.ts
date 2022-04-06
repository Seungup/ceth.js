import { Viewer } from 'cesium';
import { ApplicationContext, RendererContext } from './context';
import { RendererMap } from './core/renderer';
import { Utils } from './utils';
export * from './objects';
export * from './core';

export namespace Cesium3 {
    let isInit = false;

    export const init = (viewer: Viewer) => {
        if (!isInit) {
            ApplicationContext.getInstance().setViewer(viewer);
            isInit = true;
        }
    };

    export const Context = {
        ApplicationContext: ApplicationContext,
        RendererContext: RendererContext,
    } as const;

    export const Renderers = RendererMap;

    export const CesiumUtils = {
        ...Utils,
    } as const;

    export const render = async () => {
        await RendererContext.getInstance().doRender();
        ApplicationContext.getInstance().viewer?.render();
    };
}
