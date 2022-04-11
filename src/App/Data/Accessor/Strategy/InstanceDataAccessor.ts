import { Remote, wrap } from "comlink";
import { Vector3 } from "three";
import { CommandReciver } from "../../../Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver";
import { CoreThreadCommand } from "../../../Components/Renderer/Template/OffscreenRenderer/CoreThreadCommand";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { DataAccessor } from "../DataAccessor";

export class InstanceDataAccessor implements DataAccessor {
    private readonly wrapper: Remote<CommandReciver>;
    private readonly objectId: number;
    private readonly managerHashKey: string;
    constructor(worker: Worker, managerHashKey: string, objectId: number) {
        this.wrapper = wrap(worker);
        this.managerHashKey = managerHashKey;
        this.objectId = objectId;
    }
    async setWGS84(wgs84: IWGS84, action: WGS84_ACTION): Promise<void> {
        await CoreThreadCommand.excuteAPI(
            this.wrapper,
            "SceneComponentAPI",
            "dynamicUpdate",
            [this.managerHashKey, this.objectId, wgs84, action]
        );
    }
    async getWGS84(): Promise<IWGS84 | undefined> {
        return await CoreThreadCommand.excuteAPI(
            this.wrapper,
            "SceneComponentAPI",
            "getDynamicPosition",
            [this.managerHashKey, this.objectId]
        );
    }
    async getBox3Max(): Promise<Vector3 | undefined> {
        return;
    }
    private isRemoved = false;
    async remove(): Promise<void> {
        await CoreThreadCommand.excuteAPI(
            this.wrapper,
            "SceneComponentAPI",
            "dynamicDelete",
            [this.managerHashKey, this.objectId]
        );
        this.isRemoved = true;
    }
    async isExise(): Promise<boolean> {
        return this.isRemoved;
    }
}
