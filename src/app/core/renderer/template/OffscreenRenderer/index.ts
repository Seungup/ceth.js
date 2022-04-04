import { Object3D } from 'three';
import { CoreThreadCommand } from './core-thread.command';
import { Context } from '../../../../context';
import { Utils } from '../../../../utils';
import { PerspectiveCameraInitParam, BaseRenderer } from '../renderer.template';
import { CoreThreadCommands } from './core/command-reciver';

export class OffscreenRenderer extends BaseRenderer {
    constructor() {
        super();
        this.name = 'OffscreenRenderer';
        const canvas = this.createCanvaslement();
        if (canvas) this.setCanvasToOffscreenCanvas(canvas);
    }

    private setCanvasToOffscreenCanvas(canvas: HTMLCanvasElement) {
        if (Context.viewer) {
            try {
                const offscreen = canvas.transferControlToOffscreen();

                offscreen.width = Context.viewer.canvas.width;
                offscreen.height = Context.viewer.canvas.height;

                // prettier-ignore
                CoreThreadCommand.excuteCommand(
                    CoreThreadCommands.INIT,
                    { canvas: offscreen },
                    [offscreen]
                );
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error(
                `Failed to initialize Offscreen Render because the Context does not have a viewer configured.`
            );
        }
    }

    add(...object: Object3D[]): void {
        object.forEach((obj) => {
            CoreThreadCommand.excuteAPI('SceneComponentAPI', 'add', [obj.toJSON()]);
        });
    }

    private createCanvaslement() {
        if (!Context.viewer) {
            console.error(
                `Failed to initialize Offscreen Render because the Context does not have a viewer configured.`
            );
            return;
        }

        const canvas = document.createElement('canvas');

        Context.container.appendChild(canvas);

        const root = Context.viewer.container.parentElement;
        if (!root) {
            throw new Error('cannot fond parent element');
        } else {
            root.appendChild(Context.container);
        }

        if (Context.viewer.useDefaultRenderLoop) {
            console.warn(
                'Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in'
            );
        }

        return canvas;
    }

    setSize(width: number, height: number): void {
        CoreThreadCommand.excuteAPI('RendererComponentAPI', 'setSize', [width, height]);
    }

    setCamera(param: PerspectiveCameraInitParam): void {
        CoreThreadCommand.excuteAPI('CameraComponentAPI', 'initCamera', [param]);
    }

    render() {
        if (!Context.viewer) return;

        // Update Object3D Visibles
        {
            const threadhold = Utils.getCameraPosition(Context.viewer).height < 50 * 1000;

            // 카메라의 높이가 50km 보다 낮을 경우,
            // 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완
            CoreThreadCommand.excuteAPI('GraphicAPI', 'setRenderBehindEarthOfObjects', [
                threadhold,
            ]);
        }

        // SYNC Camera
        {
            const cvm = new Float64Array(Context.viewer.camera.viewMatrix);
            const civm = new Float64Array(Context.viewer.camera.inverseViewMatrix);

            const args = { cvm: cvm, civm: civm };
            const transfer = [cvm.buffer, civm.buffer];

            CoreThreadCommand.excuteCommand(CoreThreadCommands.SYNC, args, transfer);
        }

        // Render Request
        CoreThreadCommand.excuteCommand(CoreThreadCommands.RENDER);
    }
}
