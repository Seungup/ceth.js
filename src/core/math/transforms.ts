import { Matrix4 } from 'three';
import { CT_Ellipsoid } from './ellipsoid';
import { CT_Quaternion } from './quration';
import { MathUtils } from '../utils';
import { CT_Cartesian3 } from './cartesian3';
import { CT_Matrix4 } from './matrix4';

const vectorProductLocalFrame = {
	up: {
		south: 'east',
		north: 'west',
		west: 'south',
		east: 'north',
	},
	down: {
		south: 'west',
		north: 'east',
		west: 'north',
		east: 'south',
	},
	south: {
		up: 'west',
		down: 'east',
		west: 'down',
		east: 'up',
	},
	north: {
		up: 'east',
		down: 'west',
		west: 'up',
		east: 'down',
	},
	west: {
		up: 'north',
		down: 'south',
		north: 'down',
		south: 'up',
	},
	east: {
		up: 'south',
		down: 'north',
		north: 'up',
		south: 'down',
	},
} as const;

type AxisFirst = keyof typeof vectorProductLocalFrame;
type AxisSecond<K extends AxisFirst> = keyof typeof vectorProductLocalFrame[K];

type FixedFrameTransformFunction = {
	(origin: CT_Cartesian3): Matrix4;
};

// prettier-ignore
const degeneratePositionLocalFrame = {
	north: [-1,  0,  0],
	east:  [ 0,  1,  0],
	south: [ 1,  0,  0],
	west:  [ 0, -1,  0],
	up:    [ 0,  0,  1],
	down:  [ 0,  0, -1],
};
const scratchCalculateCartesian = {
	east: new CT_Cartesian3(),
	north: new CT_Cartesian3(),
	up: new CT_Cartesian3(),
	west: new CT_Cartesian3(),
	south: new CT_Cartesian3(),
	down: new CT_Cartesian3(),
};

export class CT_Transforms {
	static localFrameToFixedFrameCache = new Map<
		string,
		FixedFrameTransformFunction
	>();

	static localFrameToFixedFrameGenerator<K extends AxisFirst>(
		firstAixs: K,
		secondAxis: AxisSecond<K>
	) {
		const axisHash = firstAixs + secondAxis;

		let f = CT_Transforms.localFrameToFixedFrameCache.get(axisHash);

		if (f) return f;

		const thirdAxis = vectorProductLocalFrame[firstAixs][secondAxis];

		f = (origin: CT_Cartesian3, result: Matrix4 = new Matrix4()) => {
			let scratchFirstCartesian: CT_Cartesian3;
			let scratchSecondCartesian: CT_Cartesian3;
			let scratchThirdCartesian: CT_Cartesian3;

			if (origin.isZero()) {
				scratchFirstCartesian = CT_Cartesian3.unpack(
					degeneratePositionLocalFrame[firstAixs]
				);
				scratchSecondCartesian = CT_Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[secondAxis]
				);
				scratchThirdCartesian = CT_Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[thirdAxis]
				);
			} else if (
				MathUtils.equalsEpsilon(origin.x, 0.0) &&
				MathUtils.equalsEpsilon(origin.y, 0.0)
			) {
				const sign = Math.sign(origin.z);
				scratchFirstCartesian = CT_Cartesian3.unpack(
					degeneratePositionLocalFrame[firstAixs]
				);

				if (firstAixs !== 'east' && firstAixs !== 'west') {
					scratchFirstCartesian.multiplyScalar(sign);
				}

				scratchSecondCartesian = CT_Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[secondAxis]
				);

				if (secondAxis !== 'east' && secondAxis !== 'west') {
					scratchSecondCartesian.multiplyScalar(sign);
				}
				scratchThirdCartesian = CT_Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[thirdAxis]
				);

				// @ts-ignore
				if (thirdAxis !== 'east' && thirdAxis !== 'west') {
					scratchThirdCartesian.multiplyScalar(sign);
				}
			} else {
				CT_Ellipsoid.getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(
					origin,
					scratchCalculateCartesian.up
				)

				scratchCalculateCartesian.east.set(-origin.y, origin.x, 0.0).normalizeByMagnitude();

				scratchCalculateCartesian.north
					.copy(scratchCalculateCartesian.up)
					.cross(scratchCalculateCartesian.east);

				scratchCalculateCartesian.down
					.copy(scratchCalculateCartesian.up)
					.multiplyScalar(-1);

				scratchCalculateCartesian.west
					.copy(scratchCalculateCartesian.east)
					.multiplyScalar(-1);

				scratchCalculateCartesian.south
					.copy(scratchCalculateCartesian.north)
					.multiplyScalar(-1);

				scratchFirstCartesian = scratchCalculateCartesian[firstAixs];
				// @ts-ignore
				scratchSecondCartesian = scratchCalculateCartesian[secondAxis];
				// @ts-ignore
				scratchThirdCartesian = scratchCalculateCartesian[thirdAxis];
			}

			// prettier-ignore
			result.set(
				scratchFirstCartesian.x,    scratchSecondCartesian.x,   scratchThirdCartesian.x,    origin.x,
				scratchFirstCartesian.y,    scratchSecondCartesian.y,   scratchThirdCartesian.y,    origin.y,
				scratchFirstCartesian.z,    scratchSecondCartesian.z,   scratchThirdCartesian.z,    origin.z,
				0.0,                        0.0,                        0.0,                        0.0
			);
			return result;
		};

		this.localFrameToFixedFrameCache.set(axisHash, f);

		return f;
	}

	static eastNorthUpToFixedFrame = CT_Transforms.localFrameToFixedFrameGenerator('east', 'north');

	static matrix4ToFixedFrame(
		origin: CT_Cartesian3, 
		matrix: Matrix4, 
		result: Matrix4 = new Matrix4()
	) {
		return result.copy(CT_Transforms.eastNorthUpToFixedFrame(origin)).multiply(matrix);
	}

	static headingPitchRollToFixedFrame(
		origin: CT_Cartesian3,
		heading: number,
		pitch: number,
		roll: number,
		result: Matrix4 = new Matrix4()
	) {
		const hprQuration = CT_Quaternion.fromHeadingPitchRoll(heading, pitch, roll);
		
		const hprMatrix =
			CT_Matrix4.fromTranslationQuaternionRotationScale(
				CT_Cartesian3.ZERO,
				hprQuration,
				new CT_Cartesian3(1.0, 1.0, 1.0)
			);
		
		return this.matrix4ToFixedFrame(origin, hprMatrix, result);
	}
}
