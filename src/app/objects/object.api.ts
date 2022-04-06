import { Vector3 } from 'three';
import { CT_WGS84, IWGS84, WGS84_ACTION } from '../core/utils/math';
import { DataAccessStrategy } from '../core/data/AccessStrategy';

// TODO : Context에 맞게 수정될 수 있도록 변경해야함.
export class ObjectAPI {
    readonly id: number;

    private _cachedPosition: IWGS84 | undefined;
    private _cachedBox3Max: Vector3 | undefined;
    private readonly dataAccessStrategy: DataAccessStrategy;
    constructor(id: number, dataAccessStrategy: DataAccessStrategy) {
        this.id = id;
        this.dataAccessStrategy = dataAccessStrategy;
    }

    async updateAll() {
        await this.updateBox3();
        await this.updateWGS84();
        return this;
    }

    async updateWGS84() {
        const wgs84 = await this.dataAccessStrategy.getWGS84();

        if (wgs84) {
            this._cachedPosition = wgs84;
        }

        return this;
    }

    async updateBox3() {
        const max = await this.dataAccessStrategy.getBox3Max();

        if (max) {
            this._cachedBox3Max = max;
        }

        return this;
    }

    async setPosition(wgs84: IWGS84, action: WGS84_ACTION) {
        this._cachedPosition = new CT_WGS84(wgs84, action).toIWGS84();
        return await this.dataAccessStrategy.setWGS84(wgs84, action);
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
        return await this.dataAccessStrategy.remove();
    }

    async isExistObject() {
        return await this.dataAccessStrategy.isExise();
    }
}
