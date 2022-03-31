import { Viewer, Math as CesiumMath, PerspectiveFrustum } from 'cesium';
import { CoreThreadCommand } from '../../../core/core-thread';
import { Cesium3Synchronization } from '../../../core/API/synchronization';
import { CoreAPI } from '../core-api';
import { CameraComponent } from '../../../core/API/components';
import { Utils } from '../../utils';
import { BaseRenderer } from './BaseRenderer';

export class Object3DWebGLRenderer extends BaseRenderer {
    constructor(private readonly viewer: Viewer, private readonly container: HTMLDivElement) {
        super();

        const canvas = document.createElement('canvas');
        this.container.appendChild(canvas);

        const root = viewer.container.parentElement;
        if (!root) {
            throw new Error('cannot fond parent element');
        } else {
            root.appendChild(this.container);
        }

        if (viewer.useDefaultRenderLoop) {
            console.warn(
                'Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in'
            );
        }

        const offscreen = canvas.transferControlToOffscreen();
        offscreen.width = this.viewer.canvas.width;
        offscreen.height = this.viewer.canvas.height;
        CoreAPI.excuteCommand(CoreThreadCommand.INIT, { canvas: offscreen }, [offscreen]);
    }

    setSize(width: number, height: number): void {
        CoreAPI.excuteAPI('RendererComponentAPI', 'setSize', [width, height]);
    }

    setCamera(param: CameraComponent.API.CameraInitParam): void {
        CoreAPI.excuteAPI('CameraComponentAPI', 'initCamera', [param]);
    }

    /**
     * 다음 장면을 요청합니다.
     */
    render() {
        const visible = Utils.getCameraPosition(this.viewer).height < 50 * 1000;

        // 카메라의 높이가 50km 보다 낮을 경우,
        // 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완
        CoreAPI.excuteAPI('GraphicAPI', 'setRenderBehindEarthOfObjects', [visible]);

        const cvm = new Float64Array(this.viewer.camera.viewMatrix);
        const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);

        CoreAPI.excuteCommand(
            CoreThreadCommand.RENDER,
            { cvm: cvm, civm: civm } as Cesium3Synchronization.ISyncPerspectiveCameraParam,
            [cvm.buffer, civm.buffer]
        );
    }
}
