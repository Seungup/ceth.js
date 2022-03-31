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

    private getCesiumCameraMatrix(
        width: number,
        height: number
    ): CameraComponent.API.PerspectiveCameraInitParam {
        return {
            fov: Cesium.Math.toDegrees((this.viewer.camera.frustum as PerspectiveFrustum).fovy),
            near: this.viewer.camera.frustum.near,
            far: this.viewer.camera.frustum.far,
            aspect: width / height,
        };
    }

    private _oldWidth: number | undefined;
    private _oldHeight: number | undefined;
    /**
     * 필요한 경우, 렌더러와 카메라의 행렬을 업데이트합니다.
     */
    updateAll() {
        const width = this.viewer.canvas.clientWidth;
        const height = this.viewer.canvas.clientHeight;

        if (this._oldHeight !== height || this._oldWidth !== width) {
            this.CSS2DRenderer.setSize(width, height);
            this.WebGLRenderer.setSize(width, height);

            // 렌더러의 크기가 변경된 경우, 렌더링하기 위한 카메라의 행렬 또한 업데이트해야합니다.
            const param = this.getCesiumCameraMatrix(width, height);

            this.CSS2DRenderer.setCamera(param);
            this.WebGLRenderer.setCamera(param);
        }

        this._oldWidth = width;
        this._oldHeight = height;
    }

    /**
     * 모든 렌더러에게 다음 장면을 요청합니다.
     */
    renderAll() {
        this._WebGLRenderer.render();
        this._CSS2DRenderer.render();
    }
}
