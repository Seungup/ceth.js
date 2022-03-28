import { Viewer, Math as CesiumMath, PerspectiveFrustum } from 'cesium';
import { CoreThreadCommand } from '../../core/core-thread';
import { Cesium3Synchronization } from '../../core/API/synchronization';
import { CesiumUtils } from '../cesium.utils';
import { CoreAPI } from './core-api';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CT_WGS84, IWGS84, WGS84_TYPE } from '../../math';
import { CameraComponent } from '../../core/API/components';

export class ObjectRenderer {
    constructor(private readonly viewer: Viewer) {
        this._update();
    }

    private _update() {
        const w = this.viewer.canvas.width;
        const h = this.viewer.canvas.height;

        const param: CameraComponent.API.CameraInitParam = {
            fov: CesiumMath.toDegrees((this.viewer.camera.frustum as PerspectiveFrustum).fovy),
            near: this.viewer.camera.frustum.near,
            far: this.viewer.camera.frustum.far,
            aspect: w / h,
        };

        CoreAPI.excuteAPI('CameraComponentAPI', 'initCamera', [param]);

        // this.labelRenderer.setSize(w, h);
        CoreAPI.excuteAPI('RendererComponentAPI', 'setRendererSize', [w, h]);

        const visible = CesiumUtils.getCameraPosition(this.viewer).height < 50 * 1000;

        // 카메라의 높이가 50km 보다 낮을 경우,
        // 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완
        CoreAPI.excuteAPI('GraphicAPI', 'setRenderBehindEarthOfObjects', [visible]);
    }

    /**
     * 다음 장면을 요청합니다.
     */
    render() {
        this._update();

        const cvm = new Float64Array(this.viewer.camera.viewMatrix);
        const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);

        CoreAPI.excuteCommand(
            CoreThreadCommand.RENDER,
            { cvm: cvm, civm: civm } as Cesium3Synchronization.ISyncPerspectiveCameraParam,
            [cvm.buffer, civm.buffer]
        );
    }
}
