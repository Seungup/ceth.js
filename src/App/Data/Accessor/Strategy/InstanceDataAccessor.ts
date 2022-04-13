import { Vector3 } from "three";
import { CoreThreadCommand } from "../../../Components/Renderer/Template/OffscreenRenderer/CoreThreadCommand";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { DataAccessor } from "../DataAccessor";

export class InstanceDataAccessor implements DataAccessor {
    private worker?: Worker;
    private objectId?: number;
    private accessKey?: string;
    private isRemoved = false;

    setWorker(worker: Worker) {
        this.worker = worker;
    }

    setId(id: number) {
        this.objectId = id;
    }

    setAccessKey(key: string) {
        this.accessKey = key;
    }

    async setWGS84(wgs84: IWGS84, action: WGS84_ACTION): Promise<void> {
        if (this.worker && this.accessKey && this.objectId) {
            await CoreThreadCommand.excuteAPI(
                this.worker,
                "SceneComponentAPI",
                "dynamicUpdate",
                [
                    this.accessKey,
                    this.objectId,
                    {
                        position: { wgs84: wgs84, action: action },
                        headingPitchRoll: { heading: 0, pitch: 0, roll: 0 },
                        scale: new Vector3(1, 1, 1),
                    },
                ]
            );
        }
    }
    async getWGS84(): Promise<IWGS84 | undefined> {
        if (this.worker && this.accessKey && this.objectId) {
            return await CoreThreadCommand.excuteAPI(
                this.worker,
                "SceneComponentAPI",
                "getDynamicPosition",
                [this.accessKey, this.objectId]
            );
        }
    }
    async getBox3Max(): Promise<Vector3 | undefined> {
        if (this.worker && this.accessKey && this.objectId) {
            return await CoreThreadCommand.excuteAPI(
                this.worker,
                "SceneComponentAPI",
                "getDynamicBox3Max",
                [this.accessKey, this.objectId]
            );
        }
    }

    async remove(): Promise<void> {
        if (this.worker && this.accessKey && this.objectId) {
            await CoreThreadCommand.excuteAPI(
                this.worker,
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
