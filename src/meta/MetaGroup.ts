import { Group } from 'three';
import { IMetaObject } from '..';

export class MetaGroup extends Group implements IMetaObject {
	isMetaObject: boolean = true;

	constructor() {
		super();
	}

	add(...object: IMetaObject[]): this {
		super.add(...object);
		return this;
	}

	dispose() {
		for (let i = 0; i < this.children.length; i++) {
			const object = <IMetaObject>this.children[i];
			if (object.dispose) {
				object.dispose();
			}
		}
		this.clear();
	}
}
