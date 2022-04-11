import { Matrix4 } from "cesium";
import { Remote, wrap } from "comlink";
import { Object3D } from "three";
import { randInt } from "three/src/math/MathUtils";
import { disposeObject3D } from "../../../Utils/Cleaner";
import { WorkerFactory } from "../../../WorkerFactory";
import { CoreThreadCommand } from "./OffscreenRenderer/CoreThreadCommand";
import {
    CommandReciver,
    CoreThreadCommands,
} from "./OffscreenRenderer/Core/CommandReciver";
import { BaseRenderer, PerspectiveCameraInitParam } from "../BaseRenderer";
import { ApplicationContext } from "../../../Contexts/ApplicationContext";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { ObjectAPI } from "../../../Objects/ObjectAPI";
import { WorkerDataAccessor } from "../../../Data/Accessor/Strategy/WorkerDataAccessor";
import { InstanceDataAccessor } from "../../../Data/Accessor/Strategy/InstanceDataAccessor";

export class MultipleOffscreenRenderer extends BaseRenderer {
    constructor() {
        super();
        this.name = "MultipleOffscreenRenderer";
    }

    private _workerArray = new Array<{
        worker: Worker;
        wrapper: Remote<CommandReciver>;
    }>();
    private isInitialization = false;
    makeCanvases(count: number) {
        if (0 > count) {
            throw new Error("count must be higher than zero.");
        }

        if (count < this._workerArray.length) {
            throw new Error(
                "Unable to reduce the number in the runtime environment."
            );
        }

        const context = ApplicationContext.getInstance();
        if (!context.viewer) {
            throw new Error("Context is not initialized.");
        }
        const width = context.viewer.canvas.width;
        const height = context.viewer.canvas.height;

        for (let i = 0; i < count; i++) {
            const worker = WorkerFactory.createWorker("CommandReciver");

            const canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            context.container.appendChild(canvas);

            const offscreen = canvas.transferControlToOffscreen();

            offscreen.width = width;
            offscreen.height = height;

            CoreThreadCommand.excuteCommand(
                worker,
                CoreThreadCommands.INIT,
                { canvas: offscreen },
                [offscreen]
            );

            this._workerArray.push({
                worker: worker,
                wrapper: wrap<CommandReciver>(worker),
            });
        }

        this.isInitialization = true;

        return this;
    }

    async setSize(width: number, height: number) {
        if (!this.isInitialization) {
            console.warn(
                `There are no targets to setSize. Call makeCanvas to create a canvas first.`
            );
        }

        for (let i = 0; i < this._workerArray.length; i++) {
            await CoreThreadCommand.excuteAPI(
                this._workerArray[i].wrapper,
                "RendererComponentAPI",
                "setSize",
                [width, height]
            );
        }

        return this;
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        if (!this.isInitialization) {
            console.warn(
                `There are no targets to setCamera. Call makeCanvas to create a canvas first.`
            );
        }

        for (let i = 0; i < this._workerArray.length; i++) {
            CoreThreadCommand.excuteAPI(
                this._workerArray[i].wrapper,
                "CameraComponentAPI",
                "initCamera",
                [param]
            );
        }

        return this;
    }

    async add(object: Object3D) {
        return this.addAt(object, randInt(0, this._workerArray.length - 1));
    }

    async dynamicAppend(
        object: Object3D,
        at: number,
        wgs84: IWGS84,
        action?: WGS84_ACTION,
        visibility: boolean = true
    ) {
        if (this._workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const target = this._workerArray[at];

        const result = await CoreThreadCommand.excuteAPI(
            target.wrapper,
            "SceneComponentAPI",
            "dynamicAppend",
            [object.toJSON(), wgs84, action, visibility]
        );

        disposeObject3D(object);

        return await new ObjectAPI(
            result.objectId,
            new InstanceDataAccessor(
                target.worker,
                result.managerAccessKey,
                result.objectId
            )
        ).updateAll();
    }

    async addAt(
        object: Object3D,
        at: number,
        position?: IWGS84,
        action?: WGS84_ACTION
    ) {
        if (this._workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const target = this._workerArray[at];

        const id = await CoreThreadCommand.excuteAPI(
            target.wrapper,
            "SceneComponentAPI",
            "add",
            [object.toJSON(), position, action]
        );

        disposeObject3D(object);

        return await new ObjectAPI(
            id,
            new WorkerDataAccessor(target.worker, id)
        ).updateAll();
    }

    async render() {
        const viewer = ApplicationContext.getInstance().viewer;
        if (!viewer) return;

        const viewMatrix = viewer.camera.viewMatrix;
        const inverseViewMatrix = viewer.camera.inverseViewMatrix;

        for (let i = 0; i < this._workerArray.length; i++) {
            this.sendRenderRequest(
                this._workerArray[i].worker,
                viewMatrix,
                inverseViewMatrix
            );
        }
    }

    private sendRenderRequest(
        target: Worker,
        viewMatrix: Matrix4,
        inverseViewMatrix: Matrix4
    ) {
        {
            const cvm = new Float64Array(viewMatrix);
            const civm = new Float64Array(inverseViewMatrix);

            CoreThreadCommand.excuteCommand(
                target,
                CoreThreadCommands.SYNC,
                { cvm: cvm, civm: civm },
                [cvm.buffer, civm.buffer]
            );
        }

        CoreThreadCommand.excuteCommand(target, CoreThreadCommands.RENDER);
    }
}
