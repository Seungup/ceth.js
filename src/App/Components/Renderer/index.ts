import { DOMRenderer } from "./Template/DOMRenderer";
import { MultipleOffscreenRenderer } from "./Template/MultipleOffscreenRenderer/MultipleOffscreenRenderer";
import { OffscreenRendererProxy } from "./Template/OffscreenRenderer/OffscreenRendererProxy";

export * from "./Template/DOMRenderer";
export * from "./Template/OffscreenRenderer/OffscreenRendererProxy";
export * from "./Template/MultipleOffscreenRenderer/MultipleOffscreenRenderer";
export interface RendererMap {
    DOMRenderer: DOMRenderer;
    OffscreenRenderer: OffscreenRendererProxy;
    MultipleOffscreenRenderer: MultipleOffscreenRenderer;
}

export const RendererMap = {
    DOMRenderer: DOMRenderer,
    OffscreenRenderer: OffscreenRendererProxy,
    MultipleOffscreenRenderer: MultipleOffscreenRenderer,
};

export type { BaseRenderer as RendererTemplate } from "./BaseRenderer";
