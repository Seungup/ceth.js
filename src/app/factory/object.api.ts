import { Box3, Vector3 } from 'three';
import { IWGS84 } from '../../math';
import { CoreAPI } from './core-api';

export class ObjectAPI {
    readonly id: number;

    private _cachedPosition: IWGS84 | undefined;
    private _cachedBox3Max: Vector3 | undefined;
    constructor(id: number) {
        this.id = id;
    }

    async updateAll() {
        await this.updateBox3();
        await this.updateWGS84();
        return this;
    }

    async updateWGS84() {
        const wgs84 = await CoreAPI.excuteAPI('ObjectDataAPI', 'getWGS84', [this.id]);

        if (wgs84) {
            this._cachedPosition = wgs84;
        }

        return this;
    }

    async updateBox3() {
        const max = await CoreAPI.excuteAPI('ObjectDataAPI', 'getBox3Max', [this.id]);

        if (max) {
            this._cachedBox3Max = max;
        }

        return this;
    }

    async setPosition(position: IWGS84) {
        this._cachedPosition = position;
        return await CoreAPI.excuteAPI('SceneComponentAPI', 'setObjectPosition', [
            this.id,
            position,
        ]);
    }

    async getBox3() {
        if (!this._cachedBox3Max) {
            await this.updateBox3();
        }
        return this._cachedBox3Max;
    }

    async getPosition() {
        if (!this._cachedPosition) {
            await this.updateWGS84();
        }
        return this._cachedPosition;
    }

    async remove() {
        return await CoreAPI.excuteAPI('SceneComponentAPI', 'remove', [this.id]);
    }

    async isExistObject() {
        return await CoreAPI.excuteAPI('SceneComponentAPI', 'isExistObject', [this.id]);
    }
}
