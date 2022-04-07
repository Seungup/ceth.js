import { Remote, wrap } from 'comlink';
import { CommandReciver } from '../../../Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver';
import { CoreThreadCommand } from '../../../Components/Renderer/Template/OffscreenRenderer/CoreThreadCommand';
import { IWGS84, WGS84_ACTION } from '../../../Math';
import { DataAccessor } from '../DataAccessor';

export class WorkerDataAccessStaytagy implements DataAccessor {
    private readonly wrapper: Remote<CommandReciver>;
    constructor(worker: Worker, private readonly id: number) {
        this.wrapper = wrap<CommandReciver>(worker);
    }
    isExise(): Promise<boolean> {
        return CoreThreadCommand.excuteAPI(this.wrapper, 'SceneComponentAPI', 'isExistObject', [
            this.id,
        ]);
    }
    remove(): Promise<void> {
        return CoreThreadCommand.excuteAPI(this.wrapper, 'SceneComponentAPI', 'remove', [this.id]);
    }

    setWGS84(wgs84: IWGS84, action: WGS84_ACTION = WGS84_ACTION.NONE) {
        return CoreThreadCommand.excuteAPI(this.wrapper, 'SceneComponentAPI', 'setObjectPosition', [
            this.id,
            wgs84,
            action,
        ]);
    }

    getBox3Max(): Promise<any> {
        return CoreThreadCommand.excuteAPI(this.wrapper, 'ObjectDataAPI', 'getBox3Max', [this.id]);
    }

    getWGS84(): Promise<IWGS84 | undefined> {
        return CoreThreadCommand.excuteAPI(this.wrapper, 'ObjectDataAPI', 'getWGS84', [this.id]);
    }
}
