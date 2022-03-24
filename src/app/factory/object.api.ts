import { Vector3 } from 'three';
import { IWGS84 } from '../../math';
import { SingletonWorkerFactory } from '../../worker-factory';

export class ObjectAPI {
	readonly id: number;
	private readonly _coreThread =
		SingletonWorkerFactory.getWrapper('CoreThread');

	private _cachedPosition: IWGS84 | undefined;
	private _cachedBox3: Vector3 | undefined;
	constructor(id: number) {
		this.id = id;
	}

	async update(): Promise<this> {
		const userData = await this._coreThread.getUserData(this.id);

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

	delete() {
		return this._coreThread.delete(this.id);
	}

	isDisposed() {
		return this._coreThread.isExist(this.id);
	}
}