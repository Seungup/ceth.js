import { Matrix4, Vector3 } from 'three';
import { ThreeWGS84 } from '../../interface';
import { Quaternion } from '../quration';
import { Transforms } from '../transforms';
import { Cartesian3 } from './cartesian3';

export class MathUtils {
	static readonly RADIANS_PER_DEGREE = Math.PI / 180.0;
	static readonly EPSILON_01: number = 0.1;
	static readonly EPSILON_02: number = 0.01;
	static readonly EPSILON_03: number = 0.001;
	static readonly EPSILON_04: number = 0.0001;
	static readonly EPSILON_05: number = 0.00001;
	static readonly EPSILON_06: number = 0.000001;
	static readonly EPSILON_07: number = 0.0000001;
	static readonly EPSILON_08: number = 0.00000001;
	static readonly EPSILON_09: number = 0.000000001;
	static readonly EPSILON_10: number = 0.0000000001;
	static readonly EPSILON_11: number = 0.00000000001;
	static readonly EPSILON_12: number = 0.000000000001;
	static readonly EPSILON_13: number = 0.0000000000001;
	static readonly EPSILON_14: number = 0.00000000000001;
	static readonly EPSILON_15: number = 0.000000000000001;
	static readonly EPSILON_16: number = 0.0000000000000001;
	static readonly EPSILON_17: number = 0.00000000000000001;
	static readonly EPSILON_18: number = 0.000000000000000001;
	static readonly EPSILON_19: number = 0.0000000000000000001;
	static readonly EPSILON_20: number = 0.00000000000000000001;
	static readonly EPSILON_21: number = 0.000000000000000000001;

	static toRadians(degrees: number) {
		return degrees * this.RADIANS_PER_DEGREE;
	}

	static magnitudeSquared(vec: Vector3) {
		return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
	}

	static magnitude(vec: Vector3) {
		return Math.sqrt(this.magnitudeSquared(vec));
	}

	/**
	 * 절대 공차 검정 또는 상대 공차 검정을 사용하여 두 값이 같은지 여부를 확인합니다.
	 *
	 * @example
	 * MathUtils.equalsEpsilon(0.1, 0.01, MathUtils.EPSILON_01) // true
	 * MathUtils.equalsEpsilon(0.1, 0.01, MathUtils.EPSILON_02) // false
	 *
	 * @param left - The first value to compare.
	 * @param right - The other value to compare.
	 * @param relativeEpsilon
	 * @param absoluteEpsilon
	 * @returns
	 */
	static equalsEpsilon(
		left: number,
		right: number,
		relativeEpsilon: number = MathUtils.EPSILON_14,
		absoluteEpsilon: number = MathUtils.EPSILON_14
	) {
		const absDiff = Math.abs(left - right);

		return (
			absDiff <= absoluteEpsilon ||
			absDiff <=
				relativeEpsilon * Math.max(Math.abs(left), Math.abs(right))
		);
	}

	static Matrix4 = class {
		static localWGS84ToMattrix4(position: ThreeWGS84, height: number, result: Matrix4 = new Matrix4()) {
			const matrix = Transforms.headingPitchRollToFixedFrame(
				Cartesian3.fromDegree(position.longitude, position.latitude, height)
			).elements;
	
			// prettier-ignore
			return result.set(
				matrix[ 0], matrix[ 4], matrix[ 8], matrix[12],
				matrix[ 1], matrix[ 5], matrix[ 9], matrix[13],
				matrix[ 2], matrix[ 6], matrix[10], matrix[14],
				matrix[ 3], matrix[ 7], matrix[11], matrix[15]
			);
		}

		static fromTranslationQuaternionRotationScale(
			translation: Cartesian3,
			rotation: Quaternion,
			scale: Cartesian3,
			result: Matrix4 = new Matrix4()
		) {
			const scaleX = scale.x;
			const scaleY = scale.y;
			const scaleZ = scale.z;

			const x2 = rotation.x * rotation.x;
			const xy = rotation.x * rotation.y;
			const xz = rotation.x * rotation.z;
			const xw = rotation.x * rotation.w;
			const y2 = rotation.y * rotation.y;
			const yz = rotation.y * rotation.z;
			const yw = rotation.y * rotation.w;
			const z2 = rotation.z * rotation.z;
			const zw = rotation.z * rotation.w;
			const w2 = rotation.w * rotation.w;

			const m00 = x2 - y2 - z2 + w2;
			const m01 = 2.0 * (xy - zw);
			const m02 = 2.0 * (xz + yw);

			const m10 = 2.0 * (xy + zw);
			const m11 = -x2 + y2 - z2 + w2;
			const m12 = 2.0 * (yz - xw);

			const m20 = 2.0 * (xz - yw);
			const m21 = 2.0 * (yz + xw);
			const m22 = -x2 - y2 + z2 + w2;

			// prettier-ignore
			return result.set(
				m00 * scaleX, 	m10 * scaleX, 	m20 * scaleX, 	0.0,
				m01 * scaleY, 	m11 * scaleY, 	m21 * scaleY, 	0.0,
				m02 * scaleZ, 	m12 * scaleZ, 	m22 * scaleZ, 	0.0,
				translation.x, 	translation.y, 	translation.z,	1.0,
			);
		}
	};
}
