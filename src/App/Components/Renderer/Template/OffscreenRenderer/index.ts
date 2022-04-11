import { Object3D } from "three";
import { CoreThreadCommand } from "./CoreThreadCommand";
import { wrap } from "comlink";
import { PerspectiveCameraInitParam, BaseRenderer } from "../../BaseRenderer";
import { CommandReciver, CoreThreadCommands } from "./Core/CommandReciver";
import { ApplicationContext } from "../../../../Contexts/ApplicationContext";
import { WorkerFactory } from "../../../../WorkerFactory";
import { WorkerDataAccessor } from "../../../../Data/Accessor/Strategy/WorkerDataAccessor";
import { CesiumUtils } from "../../../../Utils/CesiumUtils";

export class OffscreenRenderer extends BaseRenderer {
    private worker = WorkerFactory.createWorker("CommandReciver");
    private wrapper = wrap<CommandReciver>(this.worker);
    constructor() {
        super();
        this.name = "OffscreenRendererProxy";
        const canvas = this.createCanvasElement();
        if (canvas) this.setCanvasToOffscreenCanvas(canvas);
    }

    private setCanvasToOffscreenCanvas(canvas: HTMLCanvasElement) {
        const viewer = ApplicationContext.viewer;
        if (viewer) {
            try {
                const offscreen = canvas.transferControlToOffscreen();

                offscreen.width = viewer.canvas.width;
                offscreen.height = viewer.canvas.height;

                // prettier-ignore
                CoreThreadCommand.excuteCommand(
                    this.worker,
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
        const id = await CoreThreadCommand.excuteAPI(
            this.wrapper,
            "SceneComponentAPI",
            "add",
            [object.toJSON()]
        );

        return new WorkerDataAccessor(this.worker, id);
    }

    private createCanvasElement() {
        const viewer = ApplicationContext.viewer,
            container = ApplicationContext.container;
        if (!viewer) {
            console.error(
                `Failed to initialize Offscreen Render because the Context does not have a viewer configured.`
            );
            return;
        }

        const canvas = document.createElement("canvas");

        container.appendChild(canvas);

        const root = viewer.container.parentElement;
        if (!root) {
            throw new Error("cannot fond parent element");
        } else {
            root.appendChild(container);
        }

        if (viewer.useDefaultRenderLoop) {
            console.warn(
                "Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in"
            );
        }

        return canvas;
    }

    async setSize(width: number, height: number) {
        await CoreThreadCommand.excuteAPI(
            this.wrapper,
            "RendererComponentAPI",
            "setSize",
            [width, height]
        );
        return this;
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        await CoreThreadCommand.excuteAPI(
            this.wrapper,
            "CameraComponentAPI",
            "initCamera",
            [param]
        );
        return this;
    }

    async render() {
        const viewer = ApplicationContext.viewer;
        if (!viewer) return;

        // Update Object3D Visibles
        {
            const position = CesiumUtils.getCameraPosition();
            if (position) {
                const threadhold = position.height < 50000;
                // 카메라의 높이가 50km 보다 낮을 경우,
                // 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완
                await CoreThreadCommand.excuteAPI(
                    this.wrapper,
                    "WorkerRenderer",
                    "setRenderBehindEarthOfObjects",
                    [threadhold]
                );
            }
        }

        // SYNC Camera
        {
            const cvm = new Float64Array(viewer.camera.viewMatrix);
            const civm = new Float64Array(viewer.camera.inverseViewMatrix);

            const args = { cvm: cvm, civm: civm };
            const transfer = [cvm.buffer, civm.buffer];

            await CoreThreadCommand.excuteCommand(
                this.worker,
                CoreThreadCommands.SYNC,
                args,
                transfer
            );
        }

        // Render Request
        await CoreThreadCommand.excuteCommand(
            this.worker,
            CoreThreadCommands.RENDER
        );
    }
}
