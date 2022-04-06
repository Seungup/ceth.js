import { Object3D } from 'three';
import { CoreThreadCommand } from './core-thread.command';
import { Utils } from '../../../../utils';
import { PerspectiveCameraInitParam, BaseRenderer } from '../renderer.template';
import { CoreThreadCommands } from './core/command-reciver';
import { ApplicationContext } from '../../../../context/ApplicationContext';

export class OffscreenRenderer extends BaseRenderer {
    constructor() {
        super();
        this.name = 'OffscreenRendererProxy';
        const canvas = this.createCanvasElement();
        if (canvas) this.setCanvasToOffscreenCanvas(canvas);
    }

    private setCanvasToOffscreenCanvas(canvas: HTMLCanvasElement) {
        const viewer = ApplicationContext.getInstance().viewer;
        if (viewer) {
            try {
                const offscreen = canvas.transferControlToOffscreen();

                offscreen.width = viewer.canvas.width;
                offscreen.height = viewer.canvas.height;

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

    async add(object: Object3D) {
        return await CoreThreadCommand.excuteAPI('SceneComponentAPI', 'add', [object.toJSON()]);
    }

    private createCanvasElement() {
        const context = ApplicationContext.getInstance();
        if (!context.viewer) {
            console.error(
                `Failed to initialize Offscreen Render because the Context does not have a viewer configured.`
            );
            return;
        }

        const canvas = document.createElement('canvas');

        context.container.appendChild(canvas);

        const root = context.viewer.container.parentElement;
        if (!root) {
            throw new Error('cannot fond parent element');
        } else {
            root.appendChild(context.container);
        }

        if (context.viewer.useDefaultRenderLoop) {
            console.warn(
                'Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in'
            );
        }

        return canvas;
    }

    async setSize(width: number, height: number) {
        await CoreThreadCommand.excuteAPI('RendererComponentAPI', 'setSize', [width, height]);
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        await CoreThreadCommand.excuteAPI('CameraComponentAPI', 'initCamera', [param]);
    }

    async render() {
        const context = ApplicationContext.getInstance();
        if (!context.viewer) return;

        // Update Object3D Visibles
        {
            const threadhold = Utils.getCameraPosition(context.viewer).height < 50 * 1000;

            // 카메라의 높이가 50km 보다 낮을 경우,
            // 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완
            await CoreThreadCommand.excuteAPI('GraphicAPI', 'setRenderBehindEarthOfObjects', [
                threadhold,
            ]);
        }

        // SYNC Camera
        {
            const cvm = new Float64Array(context.viewer.camera.viewMatrix);
            const civm = new Float64Array(context.viewer.camera.inverseViewMatrix);

            const args = { cvm: cvm, civm: civm };
            const transfer = [cvm.buffer, civm.buffer];

            await CoreThreadCommand.excuteCommand(CoreThreadCommands.SYNC, args, transfer);
        }

        // Render Request
        await CoreThreadCommand.excuteCommand(CoreThreadCommands.RENDER);
    }
}
