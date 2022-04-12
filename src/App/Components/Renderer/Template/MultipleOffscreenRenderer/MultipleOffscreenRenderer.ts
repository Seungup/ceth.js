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
import {
    HeadingPitchRoll,
    IWGS84,
    Position,
    WGS84_ACTION,
} from "../../../../Math";
import { WorkerDataAccessor } from "../../../../Data/Accessor/Strategy/WorkerDataAccessor";
import { InstanceDataAccessor } from "../../../../Data/Accessor/Strategy/InstanceDataAccessor";
import { THREEUtils } from "../../../../Utils/ThreeUtils";

export class MultipleOffscreenRenderer extends BaseRenderer {
    /**
     * 워커의 배열입니다. 해당 배열에 존재하는 스레드를 바탕으로 장면이 그려집니다.
     */
    workerArray = new Array<{
        worker: Worker;
        wrapper: Remote<CommandReciver>;
    }>();

    constructor() {
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
        for (let i = 0, len = this.workerArray.length; i < len; i++) {
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
        const data = await this.addAt(
            object,
            randInt(0, this.workerArray.length - 1)
        );
        const accessor = new data.constructor();
        const { id, worker } = data.param;
        accessor.setId(id);
        accessor.setWorker(worker);
        return accessor;
    }

    async dynamicAppend(
        object: Object3D,
        workerIndex: number,
        option: {
            position: Position;
            headingPitchRoll: HeadingPitchRoll;
            visibility: boolean;
        }
    ) {
        if (this.workerArray.length <= workerIndex || workerIndex < 0) {
            throw new Error(
                `BufferFlowError : cannot access at ${workerIndex} `
            );
        }
        const target = this.workerArray[workerIndex];

        const result = await CoreThreadCommand.excuteAPI(
            target.wrapper,
            "SceneComponentAPI",
            "dynamicAppend",
            [object.toJSON(), { ...option }]
        );

        if (!result) {
            throw new Error(
                `can not append the object on the scene.\ncheck the thread number : ${workerIndex}`
            );
        }

        THREEUtils.disposeObject3D(object);

        return {
            constructor: InstanceDataAccessor,
            param: {
                worker: target.worker,
                accessKey: result.managerAccessKey,
                id: result.objectId,
            },
        };
    }

    async addAt(object: Object3D, at: number, position?: Position) {
        if (this.workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const target = this.workerArray[at];

        const id = await CoreThreadCommand.excuteAPI(
            target.wrapper,
            "SceneComponentAPI",
            "add",
            [object.toJSON(), position]
        );

        THREEUtils.disposeObject3D(object);
        return {
            constructor: WorkerDataAccessor,
            param: {
                worker: target.worker,
                id: id,
            },
        };
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
