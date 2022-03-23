import { Matrix4, Vector3 } from 'three';
import { Cartesian3, Transforms } from '.';

export interface IWGS84 {
	latitude: number;
	longitude: number;
	height: number;
}

export enum WGS84_TYPE {
	CESIUM,
	THREEJS,
}

export class CT_WGS84 extends Vector3 {
	constructor(position: IWGS84, type: WGS84_TYPE) {
		if (type === WGS84_TYPE.CESIUM) {
			const latitude = position.latitude;
			position.latitude = position.longitude;
			position.longitude = latitude;
		}
		super(position.latitude, position.longitude, position.height);
	}

	get latitude() {
		return this.x;
	}

	set latitude(value: number) {
		this.setX(value);
	}

	get longitude() {
		return this.y;
	}

	set longitude(value: number) {
		this.setY(value);
	}

	get height() {
		return this.z;
	}

	set height(value: number) {
		this.setZ(value);
	}

	getMatrix4(result: Matrix4 = new Matrix4()) {
		const matrix = Transforms.matrix4ToFixedFrame(
			Cartesian3.fromDegree(this.longitude, this.latitude, this.height),
			new Matrix4()
		).elements;

		// prettier-ignore
		return result.set(
			matrix[ 0], matrix[ 4], matrix[ 8], matrix[12],
			matrix[ 1], matrix[ 5], matrix[ 9], matrix[13],
			matrix[ 2], matrix[ 6], matrix[10], matrix[14],
			matrix[ 3], matrix[ 7], matrix[11], matrix[15]
		);
	}

	toIWGS84(): IWGS84 {
		return {
			latitude: this.latitude,
			longitude: this.longitude,
			height: this.height,
		};
	}
}
