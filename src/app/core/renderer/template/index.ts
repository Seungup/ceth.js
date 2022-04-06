import { DOMRenderer } from './DOMRenderer';
import { MultipleOffscreenRenderer } from './MultipleOffscreenRenderer';
import { OffscreenRenderer } from './OffscreenRenderer';

export * from './DOMRenderer';
export * from './OffscreenRenderer';
export * from './MultipleOffscreenRenderer';

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

export type { BaseRenderer as RendererTemplate } from './renderer.template';
