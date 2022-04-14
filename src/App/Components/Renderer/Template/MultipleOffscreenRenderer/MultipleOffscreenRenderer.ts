import type { Matrix4 } from "cesium";
import type { DataAccessorBuildData } from "../../../../Data/DataAccessorFactory";
import * as THREE from "three";
import { CoreThreadCommand } from "../OffscreenRenderer/CoreThreadCommand";
import { CoreThreadCommands } from "../OffscreenRenderer/Core/CommandReciver";
import { BaseRenderer, PerspectiveCameraInitParam } from "../../BaseRenderer";
import { ApplicationContext } from "../../../../Contexts/ApplicationContext";
import { HeadingPitchRoll, Position } from "../../../../Math";
import { WorkerDataAccessor } from "../../../../Data/Accessor/Strategy/WorkerDataAccessor";
import { InstanceDataAccessor } from "../../../../Data/Accessor/Strategy/InstanceDataAccessor";
import { THREEUtils } from "../../../../Utils/ThreeUtils";
import { OffscreenRenderer } from "../OffscreenRenderer";

export class MultipleOffscreenRenderer extends BaseRenderer {
    /**
     * 워커의 배열입니다. 해당 배열에 존재하는 스레드를 바탕으로 장면이 그려집니다.
     */
    private readonly workerArray = new Array<Worker>();

    constructor() {
        super();
        this.name = "MultipleOffscreenRenderer";
        this.increaseRenderer();
    }

    get length() {
        return this.workerArray.length;
    }

    increaseRenderer() {
        const worker = new OffscreenRenderer().worker;

        worker.onmessage = (ev) => {};

        this.workerArray.push(worker);
    }

    async setSize(width: number, height: number) {
        for (let i = 0, len = this.workerArray.length; i < len; i++) {
            await CoreThreadCommand.excuteAPI(
                this.workerArray[i],
                "RendererComponentAPI",
                "setSize",
                [width, height]
            );
        }

        return this;
    }

    async setMaxiumSkibbleFrameCount(count: number) {
        for (let i = 0, len = this.workerArray.length; i < len; i++) {
            await CoreThreadCommand.excuteAPI(
                this.workerArray[i],
                "WorkerRenderer",
                "setMaxiumSkibbleFrameCount",
                [count]
            );
        }
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        for (let i = 0, len = this.workerArray.length; i < len; i++) {
            await CoreThreadCommand.excuteAPI(
                this.workerArray[i],
                "CameraComponentAPI",
                "initCamera",
                [param]
            );
        }

        return this;
    }

    async add(object: THREE.Object3D) {
        return await this.addAt(
            object,
            THREE.MathUtils.randInt(0, this.workerArray.length - 1)
        );
    }

    async dynamicAppend(
        object: THREE.Object3D,
        workerIndex: number,
        option: {
            position: Position;
            visibility: boolean;
            headingPitchRoll: HeadingPitchRoll;
        }
    ): Promise<DataAccessorBuildData> {
        if (this.workerArray.length <= workerIndex || workerIndex < 0) {
            throw new Error(
                `BufferFlowError : cannot access at ${workerIndex} `
            );
        }
        const worker = this.workerArray[workerIndex];

        const result = await CoreThreadCommand.excuteAPI(
            worker,
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
            type: InstanceDataAccessor,
            create: () => new InstanceDataAccessor(),
            update: (data) => {
                if (data instanceof InstanceDataAccessor) {
                    data.setWorker(worker);
                    data.setAccessKey(result.managerAccessKey);
                    data.setId(result.objectId);
                }
            },
        } as const;
    }

    async addAt(
        object: THREE.Object3D,
        at: number,
        position?: Position
    ): Promise<DataAccessorBuildData> {
        if (this.workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const worker = this.workerArray[at];

        const id = await CoreThreadCommand.excuteAPI(
            worker,
            "SceneComponentAPI",
            "add",
            [object.toJSON(), position]
        );

        THREEUtils.disposeObject3D(object);

        return {
            type: WorkerDataAccessor,
            create: () => new WorkerDataAccessor(),
            update: (accessor) => {
                if (accessor instanceof WorkerDataAccessor) {
                    accessor.setWorker(worker);
                    accessor.setId(id);
                }
            },
        } as const;
    }

    async render() {
        const { viewer } = ApplicationContext;

        if (!viewer) return;

        const [viewMatrix, inverseViewMatrix] = [
            viewer.camera.viewMatrix,
            viewer.camera.inverseViewMatrix,
        ];

        for (let i = 0, len = this.workerArray.length; i < len; i++) {
            this.sendRenderRequest(
                this.workerArray[i],
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
            const [cvm, civm] = [
                new Float64Array(viewMatrix),
                new Float64Array(inverseViewMatrix),
            ];

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
