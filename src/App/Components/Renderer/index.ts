import { DOMRenderer } from "./Template/DOMRenderer";
import { MultipleOffscreenRenderer } from "./Template/MultipleOffscreenRenderer";
import { OffscreenRenderer } from "./Template/OffscreenRenderer";

export * from "./Template/DOMRenderer";
export * from "./Template/OffscreenRenderer";
export * from "./Template/MultipleOffscreenRenderer";

export interface RendererMap {
    DOMRenderer: DOMRenderer;
    OffscreenRenderer: OffscreenRenderer;
    MultipleOffscreenRenderer: MultipleOffscreenRenderer;
}

export const RendererMap = {
    DOMRenderer: DOMRenderer,
    OffscreenRenderer: OffscreenRenderer,
    MultipleOffscreenRenderer: MultipleOffscreenRenderer,
};

export type { BaseRenderer as RendererTemplate } from "./BaseRenderer";
