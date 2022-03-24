import { Object3D } from 'three';
import { IMetaObject } from '..';

export class MetaObject3D extends Object3D implements IMetaObject {
	isMetaObject: boolean = true;
	constructor() {
		super();
	}
}
