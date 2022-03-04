import { CesiumWGS84, Utils } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';

export class ObjectAPI {
	readonly id: number;
	private readonly _coreThread =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(id: number) {
		this.id = id;
	}

	getUserData(key: string) {
		return this._coreThread.getUserDataAt(this.id, key);
	}

	setUserData(key: string, value: any) {
		return this._coreThread.setUserDataAt(this.id, key, value);
	}

	hide(): Promise<boolean> {
		return this._coreThread.hide(this.id);
	}

	show(): Promise<boolean> {
		return this._coreThread.show(this.id);
	}

	setPosition(position: CesiumWGS84, height: number = 0): Promise<boolean> {
		height += Utils.randomOffset();
		const threeWGS84 = Utils.CesiumWGS84ToThreeWGS84(position);
		return this._coreThread.updatePosition(this.id, {
			matrix: Utils.localWGS84ToMattrix4(threeWGS84, height),
			position: threeWGS84,
		});
	}

	async getPosition(): Promise<CesiumWGS84> {
		const position = await this._coreThread.getWGS84(this.id);
		return Utils.ThreeWGS84ToCesiumWGS84(position!);
	}

	dispose(): Promise<boolean> {
		return this._coreThread.delete(this.id);
	}

	isDisposed(): Promise<boolean> {
		return this._coreThread.isExist(this.id);
	}
}
