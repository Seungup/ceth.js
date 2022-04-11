import { Matrix4 } from "cesium";
import { Remote } from "comlink";
import { Object3D } from "three";
import { randInt } from "three/src/math/MathUtils";
import { CoreThreadCommand } from "../OffscreenRenderer/CoreThreadCommand";
import {
    CommandReciver,
    CoreThreadCommands,
} from "../OffscreenRenderer/Core/CommandReciver";
import { BaseRenderer, PerspectiveCameraInitParam } from "../../BaseRenderer";
import { ApplicationContext } from "../../../../Contexts/ApplicationContext";
import { IWGS84, WGS84_ACTION } from "../../../../Math";
import { WorkerDataAccessor } from "../../../../Data/Accessor/Strategy/WorkerDataAccessor";
import { InstanceDataAccessor } from "../../../../Data/Accessor/Strategy/InstanceDataAccessor";
import { THREEUtils } from "../../../../Utils/ThreeUtils";
import { DataAccessor } from "../../../../Data/Accessor/DataAccessor";

export class MultipleOffscreenRenderer extends BaseRenderer {
    constructor(
        private workerArray: {
            worker: Worker;
            wrapper: Remote<CommandReciver>;
        }[]
    ) {
        super();
        this.name = "MultipleOffscreenRenderer";
    }

    async setSize(width: number, height: number) {
        for (let i = 0; i < this.workerArray.length; i++) {
            await CoreThreadCommand.excuteAPI(
                this.workerArray[i].wrapper,
                "RendererComponentAPI",
                "setSize",
                [width, height]
            );
        }

        return this;
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        for (let i = 0; i < this.workerArray.length; i++) {
            CoreThreadCommand.excuteAPI(
                this.workerArray[i].wrapper,
                "CameraComponentAPI",
                "initCamera",
                [param]
            );
        }

        return this;
    }

    async add(object: Object3D) {
        return await this.addAt(
            object,
            randInt(0, this.workerArray.length - 1)
        );
    }

    async dynamicAppend(
        object: Object3D,
        at: number,
        wgs84: IWGS84,
        action?: WGS84_ACTION,
        visibility: boolean = true
    ): Promise<DataAccessor> {
        if (this.workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const target = this.workerArray[at];

        const result = await CoreThreadCommand.excuteAPI(
            target.wrapper,
            "SceneComponentAPI",
            "dynamicAppend",
            [object.toJSON(), wgs84, action, visibility]
        );

        if (!result) {
            throw new Error(
                `can not append the object on the scene.\ncheck the thread number : ${at}`
            );
        }

        THREEUtils.disposeObject3D(object);

        return new InstanceDataAccessor(
            target.worker,
            result.managerAccessKey,
            result.objectId
        );
    }

    async addAt(
        object: Object3D,
        at: number,
        position?: IWGS84,
        action?: WGS84_ACTION
    ): Promise<DataAccessor> {
        if (this.workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const target = this.workerArray[at];

        const id = await CoreThreadCommand.excuteAPI(
            target.wrapper,
            "SceneComponentAPI",
            "add",
            [object.toJSON(), position, action]
        );

        THREEUtils.disposeObject3D(object);

        return new WorkerDataAccessor(target.worker, id);
    }

    async render() {
        const viewer = ApplicationContext.viewer;
        if (!viewer) return;

        const viewMatrix = viewer.camera.viewMatrix;
        const inverseViewMatrix = viewer.camera.inverseViewMatrix;

        for (let i = 0; i < this.workerArray.length; i++) {
            this.sendRenderRequest(
                this.workerArray[i].worker,
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
