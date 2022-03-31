import { Viewer } from 'cesium';
import { CoreThreadCommand } from '../../../core/core-thread';
import { CoreAPI } from '../core-api';
import { CameraComponent } from '../../../core/API/components';
import { Utils } from '../../utils';
import { IBaseRenderer } from './BaseRenderer';

export class Object3DWebGLRenderer implements IBaseRenderer {
    constructor(private readonly viewer: Viewer, private readonly container: HTMLDivElement) {
        /**
         * Object3D 를 렌더링하는 곳은 워커 스레드에서 진행되므로,
         * 이곳에서는 워커 스레드를 초기화하는 작업이 진행되어야합니다.
         */
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

    setCamera(param: CameraComponent.API.PerspectiveCameraInitParam): void {
        CoreAPI.excuteAPI('CameraComponentAPI', 'initCamera', [param]);
    }

    render() {
        // Update Object3D Visibles
        {
            const threadhold = Utils.getCameraPosition(this.viewer).height < 50 * 1000;

            // 카메라의 높이가 50km 보다 낮을 경우,
            // 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완
            CoreAPI.excuteAPI('GraphicAPI', 'setRenderBehindEarthOfObjects', [threadhold]);
        }

        // SYNC Camera
        {
            const cvm = new Float64Array(this.viewer.camera.viewMatrix);
            const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);

            const args = { cvm: cvm, civm: civm };
            const transfer = [cvm.buffer, civm.buffer];

            CoreAPI.excuteCommand(CoreThreadCommand.SYNC, args, transfer);
        }

        // Render Request
        CoreAPI.excuteCommand(CoreThreadCommand.RENDER);
    }
}
