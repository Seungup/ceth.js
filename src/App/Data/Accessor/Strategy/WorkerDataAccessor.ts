import { Remote } from "comlink";
import { CommandReciver } from "../../../Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver";
import { CoreThreadCommand } from "../../../Components/Renderer/Template/OffscreenRenderer/CoreThreadCommand";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { WorkerWrapperMap } from "../../../WorkerFactory";
import { DataAccessor } from "../DataAccessor";

export class WorkerDataAccessor implements DataAccessor {
    private wrapper?: Remote<CommandReciver>;
    private id?: number;

    setId(id: number) {
        this.id = id;
    }

    setWorker(worker: Worker) {
        const wrapper = WorkerWrapperMap.getWrapper(worker);
        if (wrapper) {
            this.wrapper = wrapper;
        }
    }

    async isExise(): Promise<boolean> {
        if (this.wrapper && this.id) {
            return CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "isExistObject",
                [this.id]
            );
        }
        return false;
    }
    async remove(): Promise<void> {
        if (this.wrapper && this.id) {
            await CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "remove",
                [this.id]
            );
        }
    }

    async setWGS84(wgs84: IWGS84, action: WGS84_ACTION = WGS84_ACTION.NONE) {
        if (this.wrapper && this.id) {
            return CoreThreadCommand.excuteAPI(
                this.wrapper,
                "SceneComponentAPI",
                "setObjectPosition",
                [this.id, { wgs84, action }]
            );
        }
    }

    async getBox3Max(): Promise<any> {
        if (this.wrapper && this.id) {
            return CoreThreadCommand.excuteAPI(
                this.wrapper,
                "ObjectDataAPI",
                "getBox3Max",
                [this.id]
            );
        }
    }

    async getWGS84(): Promise<IWGS84 | undefined> {
        if (this.wrapper && this.id) {
            return CoreThreadCommand.excuteAPI(
                this.wrapper,
                "ObjectDataAPI",
                "getWGS84",
                [this.id]
            );
        }
    }
}
