import { Vector3 } from 'three';
import { IWGS84 } from '../core';
import { SingletonWorkerFactory } from '../core/worker-factory';

export class ObjectAPI {
    readonly id: number;
    private readonly _coreThread =
        SingletonWorkerFactory.getWrapper('CoreThread');

    private _cachedPosition: IWGS84 | undefined;
    private _cachedBox3: Vector3 | undefined;
    constructor(id: number) {
        this.id = id;
        this._coreThread.getUserData(this.id).then((userData) => {
            if (userData) {
                this._cachedPosition = userData.wgs84;
                this._cachedBox3 = new Vector3(
                    userData.box3.x,
                    userData.box3.y,
                    userData.box3.z
                );
            }
        });
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

    getBox3() {
        return this._cachedBox3;
    }

    getPosition() {
        return this._cachedPosition;
    }

    dispose() {
        return this._coreThread.delete(this.id);
    }

    isDisposed() {
        return this._coreThread.isExist(this.id);
    }
}
