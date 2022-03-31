import { sRGBEncoding, WebGLRenderer, WebGLRendererParameters } from 'three';
export namespace RendererComponent {
    export let renderer: WebGLRenderer | undefined;

    export interface InitializationParameter {
        canvas: OffscreenCanvas;
    }

    /**
     * WebGL 렌더러를 초기화합니다.
     * @param param
     */
    export const initializationWebGLRenderer = (param: InitializationParameter) => {
        if (renderer) {
            console.warn('The initialized Render has been reinitialized.');
        }

        const params: WebGLRendererParameters = {
            canvas: param.canvas,
            powerPreference: 'high-performance',
            alpha: true,
            logarithmicDepthBuffer: true,
            depth: false,
            preserveDrawingBuffer: false,
            stencil: false,
        };

        const context = param.canvas.getContext('webgl2');
        if (context) {
            params.context = context;
        }

        renderer = new WebGLRenderer(params);
        renderer.outputEncoding = sRGBEncoding;
    };

    /**
     * 메인 스레드에서 사용될 API 입니다.
     */
    export namespace API {
        /**
         * Renderer의 크기를 설정합니다.
         * @param width
         * @param height
         */
        export const setRendererSize = (width: number, height: number) => {
            if (renderer) {
                renderer.setSize(width, height, false);
            } else {
                console.warn('setRenderSize was called without Render initialization.');
            }
        };
    }
}
