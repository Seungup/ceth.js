import { Viewer } from "cesium";
import { RendererContext } from "./RendererContext";

export class ApplicationContext {
    private static instance: ApplicationContext;

    container: HTMLElement;
    viewer: Viewer | undefined;

    private constructor() {
        this.container = document.createElement("div");
        this.container.style.position = "absolute";
        this.container.style.top = "0";
        this.container.style.left = "0";
        this.container.style.height = "100%";
        this.container.style.width = "100%";
        this.container.style.margin = "0";
        this.container.style.overflow = "hidden";
        this.container.style.padding = "0";
        this.container.style.pointerEvents = "none";
    }

    setViewer(viewer: Viewer) {
        this.viewer = viewer;

        const root = viewer.container.parentElement;

        if (!root) {
            throw new Error("cannot fond parent element");
        }

        if (viewer.useDefaultRenderLoop) {
            console.warn(
                "Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in"
            );
        }

        root.appendChild(this.container);
    }

    static getInstance(): ApplicationContext {
        if (!ApplicationContext.instance) {
            ApplicationContext.instance = new ApplicationContext();
        }
        return ApplicationContext.instance;
    }
}
