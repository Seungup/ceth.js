import {
    DataAccessorBuildData,
    DataAccessorFactory,
} from "../../../../Data/DataAccessorFactory";
import * as THREE from "three";
import { CoreThreadCommand } from "../OffscreenRenderer/CoreThreadCommand";
import { BaseRenderer, PerspectiveCameraInitParam } from "../../BaseRenderer";
import { HeadingPitchRoll, Position, WGS84_ACTION } from "../../../../Math";
import { InstanceDataAccessor } from "../../../../Data/Accessor/Strategy/InstanceDataAccessor";
import { THREEUtils } from "../../../../Utils/ThreeUtils";
import { OffscreenRendererProxy } from "../OffscreenRenderer/OffscreenRendererProxy";
import { randInt } from "three/src/math/MathUtils";

export class MultipleOffscreenRenderer extends BaseRenderer {
    /**
     * 워커의 배열입니다. 해당 배열에 존재하는 스레드를 바탕으로 장면이 그려집니다.
     */
    readonly rendererArray = new Array<OffscreenRendererProxy>();

    constructor() {
        super();
        this.name = "MultipleOffscreenRenderer";
        for (let i = 0, len = navigator.hardwareConcurrency; i < len; i++) {
            this.rendererArray.push(new OffscreenRendererProxy());
        }
    }

    get length() {
        return this.rendererArray.length;
    }

    async setSize(width: number, height: number) {
        for (let i = 0, len = this.rendererArray.length; i < len; i++) {
            await this.rendererArray[i].setSize(width, height);
        }

        return this;
    }

    async setMaxiumSkibbleFrameCount(count: number) {
        for (let i = 0, len = this.rendererArray.length; i < len; i++) {
            await CoreThreadCommand.excuteAPI(
                this.rendererArray[i].worker,
                "WorkerRenderer",
                "setMaxiumSkibbleFrameCount",
                [count]
            );
        }
        return this;
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        for (let i = 0, len = this.rendererArray.length; i < len; i++) {
            await this.rendererArray[i].setCamera(param);
        }
        return this;
    }

    async add(object: THREE.Object3D) {
        return await this.addAt(
            object,
            THREE.MathUtils.randInt(0, this.rendererArray.length - 1)
        );
    }

    async dynamicAppend(
        object: THREE.Object3D,
        option: {
            position: Position;
            visibility: boolean;
            headingPitchRoll: HeadingPitchRoll;
        }
    ): Promise<DataAccessorBuildData> {
        const worker =
            this.rendererArray[randInt(0, this.rendererArray.length - 1)]
                .worker;

        const result = await CoreThreadCommand.excuteAPI(
            worker,
            "SceneComponentAPI",
            "dynamicAppend",
            [object.toJSON(), { ...option }]
        );

        if (!result) {
            throw new Error(`can not append the object on the scene.`);
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
        if (this.rendererArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const buildData = await this.rendererArray[at].add(object);

        if (position) {
            DataAccessorFactory.getCachedAccessor(buildData).setWGS84(
                position.wgs84,
                position.action || WGS84_ACTION.NONE
            );
        }

        return buildData;
    }

    async render() {
        for (let i = 0, len = this.rendererArray.length; i < len; i++) {
            await this.rendererArray[i].render();
        }
    }
}
