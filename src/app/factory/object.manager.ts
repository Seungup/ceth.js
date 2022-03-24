import { ObjectAPI } from './object.api';
import { Object3D } from 'three';
import { SingletonWorkerFactory } from '../../worker-factory';
import { IMetaObject, isMetaObject, IWGS84 } from '../..';

export class ObjectManager {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	/**
	 * 장면에 오브젝트를 추가합니다.
	 *
	 * IMetaObject의 경우 내부적에서 자동으로 관리됩니다.
	 *
	 * @param object
	 * @param position
	 * @returns
	 */
	async add<T extends IMetaObject | Object3D>(
		object: T,
		position?: IWGS84
	): Promise<ObjectAPI> {
		const id = await this.coreWrapper.add(object.toJSON(), position);

		if (isMetaObject(object) && object.dispose) {
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
