import { Box3, Object3D } from 'three';
import { CesiumWGS84 } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { Utils } from '../utils';
import { ObjectAPI } from './object.api';

export interface RequestResult {
	objectId: number;
	result: boolean;
}

export class ObjectManager {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	private _calcBox3(object: Object3D) {
		return new Box3().setFromObject(object).max;
	}

	async add(object: Object3D, position?: CesiumWGS84): Promise<ObjectAPI> {
		position = position ? Utils.CesiumWGS84ToThreeWGS84(position) : position
		const id = await this.coreWrapper.add(object.toJSON(), position);
		return new ObjectAPI(id);
	}

	async get(id: number) {
		if (await this.coreWrapper.isExist(id)) {
			return new ObjectAPI(id);
		}
	}

	async updateObject(id: number, object: Object3D): Promise<RequestResult> {
		this._calcBox3(object);
		return {
			objectId: id,
			result: await this.coreWrapper.update(id, object.toJSON()),
		};
	}
}
