import { Remote } from "comlink";
import { Vector3 } from "three";
import { CommandReciver } from "../../../Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver";
import { CoreThreadCommand } from "../../../Components/Renderer/Template/OffscreenRenderer/CoreThreadCommand";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { WorkerWrapperMap } from "../../../WorkerFactory";
import { DataAccessor } from "../DataAccessor";

export class InstanceDataAccessor implements DataAccessor {
    private wrapper?: Remote<CommandReciver>;
    private objectId?: number;
    private accessKey?: string;
    private isRemoved = false;

    setWorker(worker: Worker) {
        const wrapper = WorkerWrapperMap.getWrapper(worker);
        if (wrapper) {
            this.wrapper = wrapper;
        }
    }

    setId(id: number) {
        this.objectId = id;
    }

    setAccessKey(key: string) {
        this.accessKey = key;
    }

    async setWGS84(wgs84: IWGS84, action: WGS84_ACTION): Promise<void> {
        if (this.wrapper && this.accessKey && this.objectId) {
            await CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "dynamicUpdate",
                [
                    this.accessKey,
                    this.objectId,
                    {
                        position: { wgs84: wgs84, action: action },
                        headingPitchRoll: { heading: 0, pitch: 0, roll: 0 },
                    },
                ]
            );
        }
    }
    async getWGS84(): Promise<IWGS84 | undefined> {
        if (this.wrapper && this.accessKey && this.objectId) {
            return await CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "getDynamicPosition",
                [this.accessKey, this.objectId]
            );
        }
    }
    async getBox3Max(): Promise<Vector3 | undefined> {
        if (this.wrapper && this.accessKey && this.objectId) {
            return await CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "getDynamicBox3Max",
                [this.accessKey, this.objectId]
            );
        }
    }

    async remove(): Promise<void> {
        if (this.wrapper && this.accessKey && this.objectId) {
            await CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "dynamicDelete",
                [this.accessKey, this.objectId]
            );
            this.isRemoved = true;
        }
    }

    async isExise(): Promise<boolean> {
        return this.isRemoved;
    }
}
