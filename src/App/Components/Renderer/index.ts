import { DOMRenderer } from "./Template/DOMRenderer";
import { MultipleOffscreenRenderer } from "./Template/MultipleOffscreenRenderer/MultipleOffscreenRenderer";
import { OffscreenRenderer } from "./Template/OffscreenRenderer";

export * from "./Template/DOMRenderer";
export * from "./Template/OffscreenRenderer";
export type { MultipleOffscreenRenderer } from "./Template/MultipleOffscreenRenderer/MultipleOffscreenRenderer";
export * from "./Template/MultipleOffscreenRenderer/MultipleOffscreenBuilder";
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
