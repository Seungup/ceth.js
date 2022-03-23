import { EARTH_RADIUS_METER } from '../constants';

export * from './cartesian3';
export * from './ellipsoid';
export * from './quration';
export * from './transforms';
export * from './wgs84';

export const EPSILON_01 = 0.1;
export const EPSILON_02 = 0.01;
export const EPSILON_03 = 0.001;
export const EPSILON_04 = 0.0001;
export const EPSILON_05 = 0.00001;
export const EPSILON_06 = 0.000001;
export const EPSILON_07 = 0.0000001;
export const EPSILON_08 = 0.00000001;
export const EPSILON_09 = 0.000000001;
export const EPSILON_10 = 0.0000000001;
export const EPSILON_11 = 0.00000000001;
export const EPSILON_12 = 0.000000000001;
export const EPSILON_13 = 0.0000000000001;
export const EPSILON_14 = 0.00000000000001;
export const EPSILON_15 = 0.000000000000001;
export const EPSILON_16 = 0.0000000000000001;
export const EPSILON_17 = 0.00000000000000001;
export const EPSILON_18 = 0.000000000000000001;
export const EPSILON_19 = 0.0000000000000000001;
export const EPSILON_20 = 0.00000000000000000001;
export const EPSILON_21 = 0.000000000000000000001;

/**
 * 작은 값을 생성합니다.
 * @param epsilon
 * @returns
 */
export function randomOffset(epsilon: number = EPSILON_06) {
	return Math.floor(Math.random() * 10000) * epsilon;
}

/**
 *
 * 지구 표면에서 가장 짧은 거리인 두 지점 사이의 원 거리를 계산하여,
 * 일직선의 거리를 계산합니다.
 *
 * @link  https://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns
 */
export function haversine(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	const R = EARTH_RADIUS_METER; // metres
	const DEG2RAD = Math.PI / 180;
	const φ1 = lat1 * DEG2RAD; // φ, λ in radians
	const φ2 = lat2 * DEG2RAD;
	const Δφ = (lat2 - lat1) * DEG2RAD;
	const Δλ = (lon2 - lon1) * DEG2RAD;

	// prettier-ignore
	const a = Math.sin(Δφ/2)  * Math.sin(Δφ/2)  +
              Math.cos(φ1)    * Math.cos(φ2)    *
              Math.sin(Δλ/2)  * Math.sin(Δλ/2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in metres

	return d;
}

/**
 * 두 점 사이의 거리를 구합니다.
 * @param ax
 * @param ay
 * @param zx
 * @param zy
 * @returns
 */
export function getDistance(ax: number, ay: number, zx: number, zy: number) {
	const dis_x = ax - zx;
	const dis_y = ay - zy;
	const dist = Math.sqrt(Math.abs(dis_x ** 2) + Math.abs(dis_y ** 2));
	return dist;
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
export function equalsEpsilon(
	left: number,
	right: number,
	relativeEpsilon: number = EPSILON_14,
	absoluteEpsilon: number = EPSILON_14
) {
	const absDiff = Math.abs(left - right);
	if (absDiff <= absoluteEpsilon) return true;
	return (
		absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right))
	);
}

/**
 * 벡터의 크기를 계산합니다.
 * @param vec
 * @returns
 */
export function magnitude(vec: { x: number; y: number; z: number }) {
	return Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
}
