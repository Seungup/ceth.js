import { CoreThreadCommand } from "../../../Components/Renderer/Template/OffscreenRenderer/CoreThreadCommand";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { DataAccessor } from "../DataAccessor";

export class WorkerDataAccessor implements DataAccessor {
    private worker?: Worker;
    private objectId?: number;

    setId(id: number) {
        this.objectId = id;
    }

    setWorker(worker: Worker) {
        this.worker = worker;
    }

    async isExise(): Promise<boolean> {
        if (this.worker && this.objectId) {
            return CoreThreadCommand.excuteAPI(
                this.worker,
                "SceneComponentAPI",
                "isExistObject",
                [this.objectId]
            );
        }
        return false;
    }
    async remove(): Promise<void> {
        if (this.worker && this.objectId) {
            await CoreThreadCommand.excuteAPI(
                this.worker,
                "SceneComponentAPI",
                "remove",
                [this.objectId]
            );
        }
    }

    async setWGS84(wgs84: IWGS84, action: WGS84_ACTION = WGS84_ACTION.NONE) {
        if (this.worker && this.objectId) {
            return CoreThreadCommand.excuteAPI(
                this.worker,
                "SceneComponentAPI",
                "setObjectPosition",
                [this.objectId, { wgs84, action }]
            );
        }
    }

    async getBox3Max(): Promise<any> {
        if (this.worker && this.objectId) {
            return CoreThreadCommand.excuteAPI(
                this.worker,
                "ObjectDataAPI",
                "getBox3Max",
                [this.objectId]
            );
        }
    }

    async getWGS84(): Promise<IWGS84 | undefined> {
        if (this.worker && this.objectId) {
            return CoreThreadCommand.excuteAPI(
                this.worker,
                "ObjectDataAPI",
                "getWGS84",
                [this.objectId]
            );
        }
    }
}
