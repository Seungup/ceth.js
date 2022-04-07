import { Viewer } from 'cesium';
import { ApplicationContext } from './Context/ApplicationContext';
import { RendererContext } from './Context/RendererContext';
import { RendererMap } from './Components/Renderer';

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

    export const render = async () => {
        await RendererContext.getInstance().render();
        ApplicationContext.getInstance().viewer?.render();
    };
}
