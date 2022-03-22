import { Object3D } from 'three';
import { IWGS84, MetaObjectConstructorMap, MetaObjectClassMap } from '../core';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { ObjectAPI } from './object.api';

export interface RequestResult {
	objectId: number;
	result: boolean;
}

export class ObjectManager {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	async addObject<T extends keyof typeof MetaObjectClassMap>(
		_class: T,
		initParam: MetaObjectConstructorMap[T],
		position: IWGS84 | undefined = undefined
	) {
		const id = await this.coreWrapper.createObject(
			_class,
			initParam,
			position
		);
		if (id) {
			return await new ObjectAPI(id).update();
		}
	}

	async add<T extends Object3D>(
		object: T,
		position?: IWGS84
	): Promise<{
		object: T;
		api: ObjectAPI;
	}> {
		const id = await this.coreWrapper.add(object.toJSON(), position);
		return {
			object: object,
			api: await new ObjectAPI(id).update(),
		};
	}

	async get(id: number) {
		const isExist = await this.coreWrapper.isExist(id);
		if (isExist) {
			return await new ObjectAPI(id).update();
		}
	}

	async updateObject(id: number, object: Object3D): Promise<RequestResult> {
		return {
			objectId: id,
			result: await this.coreWrapper.update(id, object.toJSON()),
		};
	}
}
