import { Subject } from 'rxjs';
import { Object3D } from 'three';
import { IWGS84, CT_Matrix4, ObjectStore } from '../core';
import { RequestType } from '../core/core-thread';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { ObjectAPI } from './object.api';

export interface RequestResult {
	objectId: number;
	result: boolean;
}

export class ObjectManager {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');
	private readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');

	private readonly _addSubject = new Subject<number>();
	readonly add$ = this._addSubject.pipe();
	constructor() {
		this.coreWorker.onmessage = (ev) => {
			const message = ev.data;
			const type = message.type;
			if (typeof type === 'number') {
				switch (type) {
					case RequestType.ADD:
						const id = message.id;
						if (typeof id === 'number') {
							this._addSubject.next(id);
						}
						break;
					default:
						break;
				}
			}
		};
	}
	addFeature(_class: ObjectStore, updateArgs: any, position: IWGS84) {
		this.coreWorker.postMessage({
			type: RequestType.ADD,
			class: _class.name,
			update: updateArgs,
			position: position,
		});
	}

	async add(object: Object3D, position?: IWGS84): Promise<ObjectAPI> {
		const id = await this.coreWrapper.add(object.toJSON(), position);
		return new ObjectAPI(id);
	}

	async get(id: number) {
		const isExist = await this.coreWrapper.isExist(id);
		if (isExist) return new ObjectAPI(id);
	}

	async updateObject(id: number, object: Object3D): Promise<RequestResult> {
		return {
			objectId: id,
			result: await this.coreWrapper.update(id, object.toJSON()),
		};
	}
}
