import { Box3, Object3D } from 'three';
import { CesiumWGS84 } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';
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
		const id = await this.coreWrapper.add(object.toJSON());
		const obj = new ObjectAPI(id);
		const box = this._calcBox3(object);
		object.userData.box3 = box;
		if (position) {
			await obj.setPosition(position, box.y);
		}
		return obj;
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
