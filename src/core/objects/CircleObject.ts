import {
	ColorRepresentation,
	DoubleSide,
	BufferGeometry,
	LineBasicMaterial,
	Vector3,
	Float32BufferAttribute,
	Line,
} from 'three';

import { IMetaObject, MetaObjectClassCache } from './MetaObject';

export type CircleObjectConstructorOptions = {
	color: ColorRepresentation;
	radius: number;
};

export class CircleObject
	extends Line<BufferGeometry, LineBasicMaterial>
	implements IMetaObject
{
	isMetaObject: boolean = true;
	autoMerge: boolean = true;

	constructor() {
		super(
			new BufferGeometry(),
			new LineBasicMaterial({
				side: DoubleSide,
			})
		);
		this.type = 'CircleObject';
		this.name = CircleObject.name;
	}

	getClassName(): string {
		return CircleObject.name;
	}

	onInitialization(param: CircleObjectConstructorOptions) {
		const segmentCount = 50;
		const vertices: number[] = [];
		for (var i = 0; i <= segmentCount; i++) {
			const theta = (i / segmentCount) * Math.PI * 2;
			const position = new Vector3(
				Math.cos(theta) * param.radius,
				Math.sin(theta) * param.radius,
				0
			);
			vertices.push(position.x, position.y, position.z);
		}
		this.geometry.setAttribute(
			'position',
			new Float32BufferAttribute(vertices, 3)
		);
		this.material.color.set(param.color);
		this.scale.addScalar(param.radius);
	}

	dispose(): void {
		this.geometry.dispose();
		this.material.dispose();
	}
}
MetaObjectClassCache.add(CircleObject);
