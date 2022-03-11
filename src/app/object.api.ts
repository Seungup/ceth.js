import { IWGS84 } from '../core';
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

	hide() {
		return this._coreThread.hide(this.id);
	}

	show() {
		return this._coreThread.show(this.id);
	}

	setPosition(position: IWGS84) {
		return this._coreThread.setPosition(this.id, position);
	}

	getPosition() {
		return this._coreThread.getPosition(this.id);
	}

	dispose() {
		return this._coreThread.delete(this.id);
	}

	isDisposed() {
		return this._coreThread.isExist(this.id);
	}
}
