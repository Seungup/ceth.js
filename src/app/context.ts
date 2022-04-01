import { Viewer } from 'cesium';
import { RendererContext as RC } from './core/renderer/renderer.context';

export namespace Context {
    export let viewer: Viewer | undefined = undefined;
    export const container: HTMLDivElement = document.createElement('div');
    {
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.height = '100%';
        container.style.width = '100%';
        container.style.margin = '0';
        container.style.overflow = 'hidden';
        container.style.padding = '0';
        container.style.pointerEvents = 'none';
    }

    export const RendererContext = new RC();
}
