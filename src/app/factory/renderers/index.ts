import * as Cesium from 'cesium';
import PerspectiveFrustum from 'cesium/Source/Core/PerspectiveFrustum';
import { CameraComponent } from '../../../core/API/components';
import { Object3DCSS2DRenderer } from './Object3DCSS2DRenderer';
import { Object3DWebGLRenderer } from './Object3DWebGLRenderer';

export class Renderers {
    private _CSS2DRenderer: Object3DCSS2DRenderer;
    private _WebGLRenderer: Object3DWebGLRenderer;

    constructor(
        private readonly viewer: Cesium.Viewer,
        private readonly container: HTMLDivElement
    ) {
        this._CSS2DRenderer = new Object3DCSS2DRenderer(this.viewer, this.container);
        this._WebGLRenderer = new Object3DWebGLRenderer(this.viewer, this.container);
    }

    get CSS2DRenderer() {
        return this._CSS2DRenderer;
    }

    get WebGLRenderer() {
        return this._WebGLRenderer;
    }

    private _oldWidth: number | undefined;
    private _oldHeight: number | undefined;
    /**
     * 메트릭스를 모두 업데이트합니다.
     */
    updateAll() {
        const width = this.viewer.canvas.clientWidth;
        const height = this.viewer.canvas.clientHeight;

        if (this._oldHeight !== height || this._oldWidth !== width) {
            this.CSS2DRenderer.setSize(width, height);
            this.WebGLRenderer.setSize(width, height);

            const param: CameraComponent.API.CameraInitParam = {
                fov: Cesium.Math.toDegrees((this.viewer.camera.frustum as PerspectiveFrustum).fovy),
                near: this.viewer.camera.frustum.near,
                far: this.viewer.camera.frustum.far,
                aspect: width / height,
            };

            this.CSS2DRenderer.setCamera(param);
            this.WebGLRenderer.setCamera(param);
        }

        this._oldWidth = width;
        this._oldHeight = height;
    }

    /**
     * 장면을 모두 그립니다.
     */
    renderAll() {
        this._WebGLRenderer.render();
        this._CSS2DRenderer.render();
    }
}
