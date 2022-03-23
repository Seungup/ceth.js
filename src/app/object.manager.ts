import { IWGS84 } from '../math';
import { IMetaObject } from '../core/meta-object';
import { SingletonWorkerFactory } from '../worker-factory';
import { ObjectAPI } from './object.api';

export class ObjectManager {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	async add<T extends IMetaObject>(
		object: T,
		position?: IWGS84
	): Promise<ObjectAPI> {
		const id = await this.coreWrapper.add(object.toJSON(), position);

		if (object.dispose) {
			object.dispose();
		}

		return await new ObjectAPI(id).update();
	}

	async get(id: number) {
		const isExist = await this.coreWrapper.isExist(id);
		if (isExist) {
			return await new ObjectAPI(id).update();
		}
	}
}
