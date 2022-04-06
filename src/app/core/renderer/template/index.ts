import { DOMRenderer } from './DOMRenderer';
import { OffscreenRenderer } from './OffscreenRenderer';

export * from './DOMRenderer';
export * from './OffscreenRenderer';
export interface RendererMap {
    DOMRenderer: DOMRenderer;
    OffscreenRenderer: OffscreenRenderer;
}

export type { BaseRenderer as RendererTemplate } from './renderer.template';
