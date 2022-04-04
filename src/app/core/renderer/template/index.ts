import { DOMRenderer as CT_CSS2DRenderer } from './CSS2DRenderer';
import { OffscreenRenderer as CT_OffscreenRenderer } from './OffscreenRenderer';
export type { BaseRenderer as RendererTemplate } from './renderer.template';

export namespace Renderers {
    export const CSS2DRenderer = CT_CSS2DRenderer;
    export const OffscreenRenderer = CT_OffscreenRenderer;
}
