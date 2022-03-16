import { Vector3 } from "three";
import { IWGS84 } from "../core";
import { SingletonWorkerFactory } from "../core/worker-factory";

export class ObjectAPI {
    readonly id: number;
    private readonly _coreThread =
        SingletonWorkerFactory.getWrapper("CoreThread");

    private _cachedPosition: IWGS84 | undefined;
    private _cachedBox3: Vector3 | undefined;
    constructor(id: number) {
        this.id = id;
    }

    async update() {
        const userData = await this._coreThread.getUserData(this.id);

        if (userData) {
            this._cachedPosition = userData.wgs84;
            this._cachedBox3 = new Vector3(
                userData.box3.x,
                userData.box3.y,
                userData.box3.z
            );
        }
    }

    hide() {
        return this._coreThread.hide(this.id);
    }

    show() {
        return this._coreThread.show(this.id);
    }

    setPosition(position: IWGS84) {
        this._cachedPosition = position;
        return this._coreThread.setPosition(this.id, position);
    }

    async getBox3() {
        if (!this._cachedBox3) {
            await this.update();
        }
        return this._cachedBox3;
    }

    async getPosition() {
        if (!this._cachedPosition) {
            await this.update();
        }
        return this._cachedPosition;
    }

    dispose() {
        return this._coreThread.delete(this.id);
    }

    isDisposed() {
        return this._coreThread.isExist(this.id);
    }
}
