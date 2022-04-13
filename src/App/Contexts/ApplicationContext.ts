import { Viewer } from "cesium";

export namespace ApplicationContext {
    export const container = document.createElement("div");
    export let viewer: Viewer | undefined = undefined;

    {
        container;
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.left = "0";
        container.style.height = "100%";
        container.style.width = "100%";
        container.style.margin = "0";
        container.style.overflow = "hidden";
        container.style.padding = "0";
        container.style.pointerEvents = "none";
    }

    export const setViewer = (cesiumViewer: Viewer) => {
        viewer = cesiumViewer;

        const { parentElement } = viewer.container;

        if (!parentElement) {
            throw new Error("cannot fond parent element");
        }

        if (viewer.useDefaultRenderLoop) {
            console.warn(
                "Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in"
            );
        }

        parentElement.appendChild(container);
    };
}
