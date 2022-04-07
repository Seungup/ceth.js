import { Viewer } from 'cesium';
import { ApplicationContext } from './Context/ApplicationContext';
import { RendererContext } from './Context/RendererContext';
import { RendererMap } from './Core/Renderer/Template';
import { Utils } from './Utils';

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
        await RendererContext.getInstance().render();
        ApplicationContext.getInstance().viewer?.render();
    };
}
