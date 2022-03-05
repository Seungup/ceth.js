import { Matrix4 } from 'three';
import { Ellipsoid } from './ellipsoid';
import { HeadingPitchRoll } from './heading-pitch-roll';
import { Cartesian3 } from './math/cartesian3';
import { MathUtils } from './math/math.utils';
import { Quaternion } from './quration';

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
	(origin: Cartesian3): Matrix4;
};

const first: AxisFirst = 'down';
const second: AxisSecond<'down'> = 'east';
const third = vectorProductLocalFrame[first][second];

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
	east: new Cartesian3(),
	north: new Cartesian3(),
	up: new Cartesian3(),
	west: new Cartesian3(),
	south: new Cartesian3(),
	down: new Cartesian3(),
};

degeneratePositionLocalFrame[first];
degeneratePositionLocalFrame[second];
degeneratePositionLocalFrame[third];

export class Transforms {
	static localFrameToFixedFrameCache = new Map<
		string,
		FixedFrameTransformFunction
	>();

	static localFrameToFixedFrameGenerator<K extends AxisFirst>(
		firstAixs: K,
		secondAxis: AxisSecond<K>
	) {
		const axisHash = firstAixs + secondAxis;
		// if (!this.localFrameToFixedFrameCache)
		// 	this.localFrameToFixedFrameCache = new Map<
		// 		string,
		// 		FixedFrameTransformFunction
		// 	>();
		let f = Transforms.localFrameToFixedFrameCache.get(axisHash);

		if (f) return f;

		const thirdAxis = vectorProductLocalFrame[firstAixs][secondAxis];

		f = (origin: Cartesian3, result: Matrix4 = new Matrix4()) => {
			let scratchFirstCartesian: Cartesian3;
			let scratchSecondCartesian: Cartesian3;
			let scratchThirdCartesian: Cartesian3;

			if (origin.isZero()) {
				scratchFirstCartesian = Cartesian3.unpack(
					degeneratePositionLocalFrame[firstAixs]
				);
				scratchSecondCartesian = Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[secondAxis]
				);
				scratchThirdCartesian = Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[thirdAxis]
				);
			} else if (
				MathUtils.equalsEpsilon(origin.x, 0.0) &&
				MathUtils.equalsEpsilon(origin.y, 0.0)
			) {
				const sign = Math.sign(origin.z);
				scratchFirstCartesian = Cartesian3.unpack(
					degeneratePositionLocalFrame[firstAixs]
				);

				if (firstAixs !== 'east' && firstAixs !== 'west') {
					scratchFirstCartesian.multiplyScalar(sign);
				}

				scratchSecondCartesian = Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[secondAxis]
				);

				if (secondAxis !== 'east' && secondAxis !== 'west') {
					scratchSecondCartesian.multiplyScalar(sign);
				}
				scratchThirdCartesian = Cartesian3.unpack(
					// @ts-ignore
					degeneratePositionLocalFrame[thirdAxis]
				);

				// @ts-ignore
				if (thirdAxis !== 'east' && thirdAxis !== 'west') {
					scratchThirdCartesian.multiplyScalar(sign);
				}
			} else {
				Ellipsoid.WGS84.geodeticSurfaceNormal(
					origin,
					scratchCalculateCartesian.up
				);

				scratchCalculateCartesian.east.set(-origin.y, origin.x, 0.0);
				scratchCalculateCartesian.east.normalizeByMagnitude();

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
			// result.set(
			// 	scratchFirstCartesian.x,    scratchFirstCartesian.y,    scratchFirstCartesian.z,    0.0,
			// 	scratchSecondCartesian.x,   scratchSecondCartesian.y,   scratchSecondCartesian.z,   0.0,
			//     scratchThirdCartesian.x,    scratchThirdCartesian.y,    scratchThirdCartesian.z,    0.0,
			//     origin.x,                   origin.y,                   origin.z,                   0.0,
			// );
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

	static headingPitchRollToFixedFrame(
		origin: Cartesian3,
		headingPitchRoll: HeadingPitchRoll = new HeadingPitchRoll(0, 0, 0),
		result: Matrix4 = new Matrix4()
	) {
		const eastNorthUpToFixedFrame =
			Transforms.localFrameToFixedFrameGenerator('east', 'north');

		const hprQuration = Quaternion.fromHeadingPitchRoll(headingPitchRoll);
		
		const hprMatrix =
			MathUtils.Matrix4.fromTranslationQuaternionRotationScale(
				Cartesian3.ZERO,
				hprQuration,
				new Cartesian3(1.0, 1.0, 1.0)
			);

		return result.copy(eastNorthUpToFixedFrame(origin)).multiply(hprMatrix);
	}
}
