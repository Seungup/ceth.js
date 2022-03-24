import { Vector3 } from 'three';
import { IWGS84 } from '../../math';
import { CoreAPI } from './core-api';

export class ObjectAPI {
	readonly id: number;

	private _cachedPosition: IWGS84 | undefined;
	private _cachedBox3: Vector3 | undefined;
	constructor(id: number) {
		this.id = id;
	}

	async update(): Promise<this> {
		const userData = await CoreAPI.excuteAPI('SceneAPI', 'getUserData', [
			this.id,
		]);

		if (userData) {
			if (userData.wgs84) {
				this._cachedPosition = userData.wgs84;
			}
			if (userData.box3) {
				this._cachedBox3 = new Vector3(
					userData.box3.x,
					userData.box3.y,
					userData.box3.z
				);
			}
		}
		return this;
	}

	async setPosition(position: IWGS84) {
		this._cachedPosition = position;
		return await CoreAPI.excuteAPI('SceneAPI', 'setObjectPosition', [
			this.id,
			position,
		]);
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

	async remove() {
		return await CoreAPI.excuteAPI('SceneAPI', 'remove', [this.id]);
	}

	async isExistObject() {
		return await CoreAPI.excuteAPI('SceneAPI', 'isExistObject', [this.id]);
	}
}
