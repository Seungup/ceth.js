import { Vector3 } from 'three';
import { MathUtils } from './math.utils';

export class Cartesian3 extends Vector3 {
	static get WGS84_RADII_SQUARED() {
		return new Cartesian3(
			6378137.0 * 6378137.0,
			6378137.0 * 6378137.0,
			6356752.3142451793 * 6356752.3142451793
		);
	}

	static get UINT_X() {
		return new Cartesian3(1.0, 0.0, 0.0);
	}

	static get UINT_Y() {
		return new Cartesian3(0.0, 1.0, 0.0);
	}

	static get UINT_Z() {
		return new Cartesian3(0.0, 0.0, 1.0);
	}

	static get ZERO() {
		return new Cartesian3(0, 0, 0);
	}

	normalizeByMagnitude() {
		return this.divideScalar(MathUtils.magnitude(this));
	}

	static fromDegree(longitude: number, latitude: number, height: number) {
		return this.fromRadians(
			MathUtils.toRadians(longitude),
			MathUtils.toRadians(latitude),
			height
		);
	}

	static fromRadians(longitude: number, latitude: number, height: number) {
		const cosLatitude = Math.cos(latitude);

		const cartesian = new Cartesian3(
			cosLatitude * Math.cos(longitude),
			cosLatitude * Math.sin(longitude),
			Math.sin(latitude)
		).normalizeByMagnitude();

		const WGS84_RADII_SQUARED =
			Cartesian3.WGS84_RADII_SQUARED.multiply(cartesian);

		const gamma = Math.sqrt(WGS84_RADII_SQUARED.dot(cartesian));

		WGS84_RADII_SQUARED.divideScalar(gamma);
		cartesian.multiplyScalar(height);

		return cartesian.add(WGS84_RADII_SQUARED);
	}

	isZero() {
		return Cartesian3.equalsEpsilon(this, Cartesian3.ZERO);
	}

	static unpack(
		array: Array<number>,
		startIndex: number = 0,
		result: Cartesian3 = new Cartesian3()
	) {
		result.x = array[startIndex++];
		result.y = array[startIndex++];
		result.z = array[startIndex];
		return result;
	}

	static equalsEpsilon(
		left: Cartesian3,
		right: Cartesian3,
		relativeEpsilon: number = MathUtils.EPSILON_14,
		absoluteEpsilon: number = MathUtils.EPSILON_14
	) {
		return (
			MathUtils.equalsEpsilon(
				left.x,
				right.x,
				relativeEpsilon,
				absoluteEpsilon
			) &&
			MathUtils.equalsEpsilon(
				left.y,
				right.y,
				relativeEpsilon,
				absoluteEpsilon
			) &&
			MathUtils.equalsEpsilon(
				left.z,
				right.z,
				relativeEpsilon,
				absoluteEpsilon
			)
		);
	}
}
