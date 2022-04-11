import { Viewer } from "cesium";
import { ApplicationContext } from "./Contexts/ApplicationContext";
import { RendererContext } from "./Contexts/RendererContext";
import { RendererMap } from "./Components/Renderer";

export namespace Cesium3 {
    let isInit = false;

    export const init = (viewer: Viewer) => {
        if (!isInit) {
            ApplicationContext.setViewer(viewer);
            isInit = true;
        }
    };

    export const Context = {
        ApplicationContext: ApplicationContext,
        RendererContext: RendererContext,
    } as const;

    export const Renderers = RendererMap;

    export const render = () => {
        RendererContext.render();
    };
}
